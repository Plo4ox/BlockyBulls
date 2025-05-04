import React, { useState, useEffect, useCallback } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import {
  simplePollContract,
  blockyBullsContract,
  BlockyBullsContractAddress,
} from "../../../consts/contracts";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import { prepareContractCall, readContract } from "thirdweb";

const PollContent = ({
  poll,
  hasVoted,
  hasRequiredTokens,
  activeAccount,
  onVoteSubmitted,
  onPollUpdate,
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { toast } = useToast();

  const COMMENTS_PER_PAGE = 10;
  const now = Date.now() / 1000;
  const isPollEnded = now >= poll.endTime || now < poll.startTime;
  const canVote = !isPollEnded && !hasVoted && hasRequiredTokens;
  const canComment = !isPollEnded && hasRequiredTokens;
  const hasMoreComments = totalComments > (currentPage + 1) * COMMENTS_PER_PAGE;

  const fetchUpdatedPollData = async () => {
    try {
      const updatedPoll = await readContract({
        contract: simplePollContract,
        method: "getPoll",
        params: [poll.id],
      });

      const updatedPollData = {
        ...poll,
        totalVotes: Number(updatedPoll.totalVotes),
        forVotes: Number(updatedPoll.forVotes),
        againstVotes: Number(updatedPoll.againstVotes),
        neutralVotes: Number(updatedPoll.neutralVotes),
      };

      onPollUpdate(updatedPollData);
    } catch (err) {
      console.error("Error fetching updated poll data:", err);
    }
  };

  const fetchCommentsPage = async (page) => {
    try {
      setIsLoadingComments(true);
      const [commentsData, total] = await readContract({
        contract: simplePollContract,
        method: "getCommentsPage",
        params: [poll.id, page, COMMENTS_PER_PAGE],
      });

      if (page === 0) {
        setComments(commentsData);
      } else {
        setComments((prev) => [...prev, ...commentsData]);
      }
      setTotalComments(Number(total));
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchCommentsPage(0);
  }, [poll.id]);

  function shortenAddress(address, chars = 4) {
    if (!address) return "";
    return `${address.substring(0, chars + 2)}...${address.substring(
      address.length - chars
    )}`;
  }

  const handleLoadMoreComments = () => {
    if (!isLoadingComments && hasMoreComments) {
      fetchCommentsPage(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleVote = (vote) => {
    if (!activeAccount || !poll || typeof vote !== "number") return;

    return {
      transaction: () =>
        prepareContractCall({
          contract: simplePollContract,
          method: "submitVote",
          params: [poll.id, vote],
        }),
      onTransactionSent: () => {
        setIsVoting(true);
        toast({
          title: "Submitting vote...",
          description: "Please wait while your vote is being processed",
        });
      },
      onTransactionConfirmed: async () => {
        setIsVoting(false);
        toast({
          title: "Vote submitted",
          description: "Your vote has been recorded.",
        });
        await fetchUpdatedPollData();
        onVoteSubmitted(poll.id);
      },
      onError: (error) => {
        setIsVoting(false);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    };
  };

  const handleComment = () => {
    if (!newComment.trim()) return;

    return {
      transaction: () =>
        prepareContractCall({
          contract: simplePollContract,
          method: "addComment",
          params: [poll.id, newComment.trim()],
        }),
      onTransactionSent: () => {
        setIsSubmittingComment(true);
        toast({
          title: "Submitting comment...",
          description: "Please wait while your comment is being processed",
        });
      },
      onTransactionConfirmed: async () => {
        setNewComment("");
        setIsSubmittingComment(false);
        toast({
          title: "Comment submitted",
          description: "Your comment has been added successfully",
        });

        // Reset to first page and fetch latest comments
        setCurrentPage(0);
        await Promise.all([fetchCommentsPage(0), fetchUpdatedPollData()]);
      },
      onError: (error) => {
        setIsSubmittingComment(false);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    };
  };

  const renderResults = () => {
    const now = Date.now() / 1000;
    const hasStarted = now >= poll.startTime;

    // Don't show results if poll hasn't started
    if (!hasStarted) {
      return (
        <div className="mt-4 space-y-4 rounded-lg bg-zinc-900/50 p-4">
          <h4 className="font-semibold">
            Poll starts{" "}
            {formatDistanceToNow(poll.startTime * 1000, { addSuffix: true })}
          </h4>
        </div>
      );
    }

    const totalVotes = poll.totalVotes;
    const results = [
      { label: "For", votes: poll.forVotes, color: "bg-green-500" },
      { label: "Against", votes: poll.againstVotes, color: "bg-red-500" },
      { label: "Neutral", votes: poll.neutralVotes, color: "bg-gray-500" },
    ];

    return (
      <div className="mt-4 space-y-4 rounded-lg bg-zinc-900/50 p-4">
        <h4 className="mb-4 font-semibold">
          {isPollEnded ? "Final Results" : "Current Results"}
        </h4>
        {results.map((result, index) => {
          const percentage =
            totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{result.label}</span>
                <span>
                  {percentage}% ({result.votes} votes)
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-700">
                <div
                  className={`h-full rounded-full ${result.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <p className="mt-2 text-sm text-gray-500">Total votes: {totalVotes}</p>
      </div>
    );
  };

  const renderVotingSection = () => {
    if (!canVote) return null;

    return (
      <div className="mt-4 space-y-4">
        <h4 className="mb-4 font-semibold">Cast your vote</h4>
        <div className="grid grid-cols-1 gap-4">
          <TransactionButton
            {...handleVote(0)}
            disabled={isVoting}
            className="w-full rounded bg-green-500 px-4 py-3 text-white hover:bg-green-600 disabled:bg-gray-600"
          >
            Vote For
          </TransactionButton>
          <TransactionButton
            {...handleVote(1)}
            disabled={isVoting}
            className="w-full rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600 disabled:bg-gray-600"
          >
            Vote Against
          </TransactionButton>
          <TransactionButton
            {...handleVote(2)}
            disabled={isVoting}
            className="w-full rounded bg-gray-500 px-4 py-3 text-white hover:bg-gray-600 disabled:bg-gray-600"
          >
            Neutral
          </TransactionButton>
        </div>
      </div>
    );
  };

  const renderVotingStatus = () => {
    if (!hasRequiredTokens && poll.minTokensRequired > 0) {
      return (
        <div className="mb-8 mt-4 rounded-lg bg-zinc-900/50 p-4 text-center">
          <p className="mb-4 text-yellow-500">
            You need at least {poll.minTokensRequired} NFT to participate in
            this poll
          </p>
          <a
            href={`https://opensea.io/collection/${poll.nftCollection}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 hover:no-underline"
          >
            Get NFTs on OpenSea
          </a>
        </div>
      );
    }

    if (hasVoted && !isPollEnded) {
      return (
        <div className="mt-4 rounded-lg bg-zinc-900/50 p-4 text-center">
          <p className="text-gray-400">You have voted on this poll.</p>
          {renderResults()}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border-t border-zinc-700 p-6 pt-0">
      {isPollEnded && renderResults()}

      {!isPollEnded && (
        <>
          {renderVotingSection()}
          {renderVotingStatus()}
        </>
      )}

      {canComment && (
        <div className="mt-8 space-y-4">
          <h4 className="font-semibold">Discussion</h4>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="rounded-lg bg-zinc-900/50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-sm text-blue-400">
                    {shortenAddress(comment.commenter)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(Number(comment.timestamp) * 1000, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}

            {comments.length === 0 && !isLoadingComments && (
              <p className="text-center text-gray-500">No comments yet</p>
            )}

            {isLoadingComments && (
              <div className="p-4 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
              </div>
            )}

            {hasMoreComments && !isLoadingComments && (
              <button
                onClick={handleLoadMoreComments}
                className="w-full p-2 text-blue-400 transition-colors hover:text-blue-300"
              >
                Load More Comments
              </button>
            )}
          </div>

          {activeAccount && hasRequiredTokens && (
            <div className="mt-6 space-y-2 border-t border-zinc-700 pt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmittingComment}
                placeholder="Add to the discussion..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                rows={3}
              />
              <TransactionButton
                {...handleComment()}
                disabled={!newComment.trim() || isSubmittingComment}
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-600"
              >
                Post Comment
              </TransactionButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreatePollDialog = ({ isOpen, onClose, onPollCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minTokens, setMinTokens] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  // Use useCallback to memoize the handleCreate function
  const handleCreate = useCallback(() => {
    if (!title || !description || !startDate || !endDate) return null;

    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    if (startTimestamp >= endTimestamp) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return null;
    }

    return {
      transaction: () =>
        prepareContractCall({
          contract: simplePollContract,
          method: "createPoll",
          params: [
            title,
            description,
            BlockyBullsContractAddress,
            startTimestamp,
            endTimestamp,
            minTokens,
          ],
        }),
      onTransactionSent: () => {
        toast({
          title: "Creating poll...",
          description: "Please wait while your poll is being created",
        });
      },
      onTransactionConfirmed: () => {
        toast({
          title: "Poll created",
          description: "Your poll has been created successfully",
        });
        onClose();
        onPollCreated();
        // Reset form
        setTitle("");
        setDescription("");
        setMinTokens(1);
        setStartDate("");
        setEndDate("");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    };
  }, [
    title,
    description,
    startDate,
    endDate,
    minTokens,
    onClose,
    onPollCreated,
    toast,
  ]); // Add all dependencies

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg space-y-4 rounded-lg bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Poll</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 focus:border-blue-500"
              placeholder="Poll title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 focus:border-blue-500"
              placeholder="Poll description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Minimum Required Tokens
            </label>
            <input
              type="number"
              value={minTokens}
              onChange={(e) =>
                setMinTokens(Math.max(1, Number(e.target.value)))
              }
              min="1"
              className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Date</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <TransactionButton
          {...(handleCreate() || {})}
          disabled={!title || !description || !startDate || !endDate}
          className="mt-6 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-600"
        >
          Create Poll
        </TransactionButton>
      </div>
    </div>
  );
};

export default function SimplePollPage() {
  const activeAccount = useActiveAccount();
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingStatus, setVotingStatus] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [expandedPollId, setExpandedPollId] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (activeAccount) {
        try {
          const owner = await readContract({
            contract: simplePollContract,
            method: "owner",
            params: [],
          });
          setIsOwner(
            owner.toLowerCase() === activeAccount.address.toLowerCase()
          );
        } catch (err) {
          console.error("Error checking owner:", err);
        }
      }
    };
    checkOwner();
  }, [activeAccount]);

  const getAllPolls = async () => {
    try {
      // First get nextPollId to know how many polls exist
      const nextPollId = await readContract({
        contract: simplePollContract,
        method: "nextPollId",
        params: [],
      });

      if (Number(nextPollId) === 0) {
        setPolls([]);
        setIsLoading(false);
        return;
      }

      // Use Promise.allSettled instead of Promise.all to handle failed poll fetches
      const pollPromises = Array.from({ length: Number(nextPollId) }, (_, i) =>
        readContract({
          contract: simplePollContract,
          method: "getPoll", // Use getPoll instead of polls mapping directly
          params: [i],
        })
          .then((poll) => ({
            id: i,
            title: poll.title,
            description: poll.description,
            nftCollection: poll.nftCollection,
            startTime: Number(poll.startTime),
            endTime: Number(poll.endTime),
            totalVotes: Number(poll.totalVotes),
            minTokensRequired: Number(poll.minTokensRequired),
            forVotes: Number(poll.forVotes),
            againstVotes: Number(poll.againstVotes),
            neutralVotes: Number(poll.neutralVotes),
          }))
          .catch(() => null)
      );

      const results = await Promise.allSettled(pollPromises);
      const validPolls = results
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);

      // Sort polls by startTime in descending order (most recent first)
      const sortedPolls = validPolls.sort((a, b) => b.startTime - a.startTime);
      setPolls(sortedPolls);

      if (activeAccount) {
        await updateUserStatus(sortedPolls);
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to fetch polls. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (currentPolls) => {
    try {
      if (!activeAccount || currentPolls.length === 0) return;

      const votingPromises = currentPolls.map((poll) =>
        readContract({
          contract: simplePollContract,
          method: "hasVoted",
          params: [poll.id, activeAccount.address],
        }).catch(() => false)
      );

      const uniqueCollections = [
        ...new Set(currentPolls.map((poll) => poll.nftCollection)),
      ];
      const balancePromises = uniqueCollections.map((collection) =>
        readContract({
          contract: blockyBullsContract,
          method: "balanceOf",
          params: [activeAccount.address],
        }).catch(() => 0)
      );

      const [votingResults, balanceResults] = await Promise.all([
        Promise.all(votingPromises),
        Promise.all(balancePromises),
      ]);

      const newVotingStatus = votingResults.reduce((acc, hasVoted, index) => {
        acc[currentPolls[index].id] = hasVoted;
        return acc;
      }, {});
      setVotingStatus(newVotingStatus);

      const newTokenBalances = uniqueCollections.reduce(
        (acc, collection, index) => {
          acc[collection] = Number(balanceResults[index]);
          return acc;
        },
        {}
      );
      setTokenBalances(newTokenBalances);
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  useEffect(() => {
    getAllPolls();
  }, [activeAccount]);

  const handleVoteSubmitted = async (pollId) => {
    if (activeAccount) {
      const [hasVoted, pollDetails] = await Promise.all([
        readContract({
          contract: simplePollContract,
          method: "hasVoted",
          params: [pollId, activeAccount.address],
        }),
        readContract({
          contract: simplePollContract,
          method: "polls",
          params: [pollId],
        }),
      ]);

      setVotingStatus((prev) => ({
        ...prev,
        [pollId]: hasVoted,
      }));

      setPolls((prev) =>
        prev.map((poll) => {
          if (poll.id === pollId) {
            return {
              ...poll,
              totalVotes: Number(pollDetails[5]),
              forVotes: Number(pollDetails[7]),
              againstVotes: Number(pollDetails[8]),
              neutralVotes: Number(pollDetails[9]),
            };
          }
          return poll;
        })
      );
    }
  };

  const getFilteredPolls = () => {
    const now = Date.now() / 1000;
    return polls.filter((poll) => {
      switch (activeTab) {
        case "active":
          return now >= poll.startTime && now < poll.endTime;
        case "ended":
          return now >= poll.endTime;
        case "upcoming":
          return now < poll.startTime;
        default:
          return true;
      }
    });
  };

  const PollItem = ({ poll }) => {
    const isExpanded = expandedPollId === poll.id;
    const now = Date.now() / 1000;
    const isPollEnded = now >= poll.endTime;
    const isPollUpcoming = now < poll.startTime;

    return (
      <div className="rounded-lg border transition-all duration-300 ease-in-out">
        <div
          onClick={() => setExpandedPollId(isExpanded ? null : poll.id)}
          className="cursor-pointer p-6 transition-colors hover:bg-zinc-800/30"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{poll.title}</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {isPollEnded ? (
                  <span className="rounded bg-gray-500 px-2 py-1 text-sm text-white">
                    Ended
                  </span>
                ) : isPollUpcoming ? (
                  <span className="rounded bg-yellow-500 px-2 py-1 text-sm text-white">
                    Upcoming
                  </span>
                ) : (
                  <span className="rounded bg-green-500 px-2 py-1 text-sm text-white">
                    Active
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </div>
          </div>
          <p
            className={`mt-2 text-gray-500 ${isExpanded ? "" : "line-clamp-2"}`}
          >
            {poll.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div>Votes: {poll.totalVotes}</div>
            {poll.minTokensRequired > 0 && (
              <div>Min. tokens: {poll.minTokensRequired}</div>
            )}
            <div>
              {isPollEnded
                ? "Ended"
                : isPollUpcoming
                ? `Starts ${formatDistanceToNow(poll.startTime * 1000, {
                    addSuffix: true,
                  })}`
                : `Ends ${formatDistanceToNow(poll.endTime * 1000, {
                    addSuffix: true,
                  })}`}
            </div>
          </div>
        </div>
        {isExpanded && (
          <PollContent
            poll={poll}
            hasVoted={votingStatus[poll.id]}
            hasRequiredTokens={
              tokenBalances[poll.nftCollection] >= poll.minTokensRequired
            }
            activeAccount={activeAccount}
            onVoteSubmitted={handleVoteSubmitted}
            onPollUpdate={(updatedPoll) => {
              setPolls((prev) =>
                prev.map((p) => (p.id === updatedPoll.id ? updatedPoll : p))
              );
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="mb-8 mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <header className="flex max-w-2xl items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  BlockyBulls Polls
                </h1>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                  Vote on proposals that shape the future of the BlockyBulls
                </p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Create Poll
                </button>
              )}
            </header>
            <div className="mt-8">
              <div className="mb-4 flex">
                {["all", "upcoming", "active", "ended"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-semibold ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 rounded-lg bg-gray-700"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <div className="space-y-4">
                  {getFilteredPolls().length > 0 ? (
                    getFilteredPolls().map((poll) => (
                      <PollItem key={poll.id.toString()} poll={poll} />
                    ))
                  ) : (
                    <div className="rounded-lg bg-zinc-900/50 p-8 text-center">
                      <p className="text-gray-500">
                        No {activeTab} polls available
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreatePollDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onPollCreated={getAllPolls}
      />
    </div>
  );
}
