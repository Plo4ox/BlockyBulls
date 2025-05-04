import { useClickAway } from "react-use";
import { useRef, useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";

export default function BurgerMenu({ onMeSelected, activeAccount }) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setOpen(false));

  async function onMe() {
    setOpen((prev) => !prev);
    onMeSelected();
  }

  return (
    <div ref={ref} className="lg:hidden">
      <button className="group flex h-full items-center rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-black dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
        <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
      </button>
      {isOpen ? (
        <div className="shadow-4xl fixed left-0 right-0 z-10 m-4 rounded-xl bg-black bg-white/90 p-5 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-black dark:text-zinc-200 dark:ring-white/10 ">
          <ul className="grid gap-2">
            <li>
              <a
                className="relative block w-full px-3 py-2 transition hover:text-blue-500"
                href="https://mirror.xyz/blockybulls.eth"
              >
                Articles
              </a>
            </li>
            <hr />
            <li>
              <Link
                onClick={() => {
                  setOpen((prev) => !prev);
                }}
                to="collections/"
                className="relative block w-full px-3 py-2 transition hover:text-blue-500"
              >
                Collections
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
