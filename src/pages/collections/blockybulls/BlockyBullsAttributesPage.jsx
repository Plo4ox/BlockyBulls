import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import optimizedData from "../data/optimizedAttributeData.json";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getNFTImageUrl } from "../../../lib/utils/imageUtils";

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-12">
      <div
        className="mb-4 flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-bold">{title}</h2>
        {isOpen ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const BlockyBullsAttributesPage = () => {
  const navigate = useNavigate();

  const totalNFTs = Object.keys(optimizedData.nfts).length;

  const attributeStats = useMemo(() => {
    const stats = {};
    Object.entries(optimizedData.attributeOptions).forEach(
      ([attribute, options]) => {
        stats[attribute] = options
          .map((option) => {
            // Use the length of the nftsByAttribute array for the count
            const count =
              optimizedData.nftsByAttribute[attribute][option].length;
            return { option, count };
          })
          .sort((a, b) => a.count - b.count);
      }
    );
    return stats;
  }, []);

  const getRandomPreviewNFTs = (attribute, option) => {
    const matchingNFTs = optimizedData.nftsByAttribute[attribute][option];
    const shuffled = [...matchingNFTs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((id) => optimizedData.nfts[id]);
  };

  const handleNFTClick = (nftId) => {
    navigate(`/collection/BlockyBulls/token/${Number(nftId) - 1}`);
  };

  const PreviewImage = ({ nft }) => (
    <div
      className="transform cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md active:scale-95"
      onClick={() => handleNFTClick(nft.id)}
    >
      <OptimizedImage
        src={getNFTImageUrl("blockybulls", Number(nft.id) - 1, {
          size: "small",
        })}
        alt={`BlockyBull #${nft.id}`}
        className="h-16 w-16"
        shape="squircle"
      />
    </div>
  );

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold">
              BlockyBulls Collection Attributes
            </h1>
            <p className="mb-8 mt-6 text-base text-zinc-600 dark:text-zinc-400">
              Explore the various attributes of BlockyBulls NFT Collection.
            </p>
            {Object.entries(attributeStats).map(([category, attributes]) => (
              <CollapsibleSection key={category} title={category}>
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b pb-2 font-bold dark:border-gray-700">
                        <th className="p-2 text-left">Attribute</th>
                        <th className="p-2 text-left">Count</th>
                        <th className="p-2 text-left">Percentage</th>
                        <th className="p-2 text-right">Preview</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attributes.map(({ option, count }) => (
                        <tr key={option} className="dark:border-gray-700">
                          <td className="p-2">
                            <Link
                              to={`/collection/blockybulls/explorer?category=${category}&option=${option}`}
                              className="text-blue-500 hover:underline"
                            >
                              {option}
                            </Link>
                          </td>
                          <td className="p-2">{count}</td>
                          <td className="p-2">
                            {((count / totalNFTs) * 100).toFixed(2)}%
                          </td>
                          <td className="p-2">
                            <div className="flex justify-end space-x-2">
                              {getRandomPreviewNFTs(category, option).map(
                                (nft) => (
                                  <PreviewImage key={nft.id} nft={nft} />
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockyBullsAttributesPage;
