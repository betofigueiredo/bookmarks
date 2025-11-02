import { createFileRoute } from "@tanstack/react-router";
import { useDebouncedValue, ReactDebouncer } from "@tanstack/react-pacer";

export const Route = createFileRoute("/")({ component: App });

type Bookmark = {
  id: string;
  title: string;
  children?: Bookmark[];
};

type Selects = Record<number, string | null>;

function Item({
  level,
  bookmark,
  selects,
  selectsDebouncer,
}: {
  level: number;
  bookmark: Bookmark;
  selects: Selects;
  selectsDebouncer: ReactDebouncer<
    React.Dispatch<React.SetStateAction<Selects>>
  >;
}) {
  const isSelected = selects[level] === bookmark.id;

  function hoverHandler(bookmarkID: string | null) {
    // Cancel pending updates
    selectsDebouncer.cancel();

    // Clear all levels after the current one
    const updatedSelects = Object.entries(selects).reduce(
      (acc, [key, value]) => {
        const keyNum = Number(key);
        if (keyNum <= level) {
          acc[keyNum] = value;
        }
        return acc;
      },
      {} as Selects,
    );

    // Set the current level to the new bookmark ID
    updatedSelects[level] = bookmarkID;

    // Schedule the update
    selectsDebouncer.maybeExecute(updatedSelects);
  }

  function showChildren() {
    hoverHandler(bookmark.id);
  }

  function hideChildren() {
    hoverHandler(null);
  }

  return (
    <div className="relative flex">
      {bookmark.id !== "root" && (
        <div className="flex flex-col">
          <button
            type="button"
            className="px-4 py-2 text-left hover:bg-gray-100 rounded transition-colors whitespace-nowrap"
            onMouseEnter={showChildren}
            onMouseLeave={hideChildren}
          >
            {bookmark.title}
          </button>
        </div>
      )}
      {(isSelected || bookmark.id === "root") && (
        <div
          className={`flex flex-col ${bookmark.id === "root" ? "" : "absolute left-full top-0"}`}
          onMouseEnter={showChildren}
        >
          {bookmark?.children?.map((child) => (
            <Item
              key={child.id}
              level={level + 1}
              bookmark={child}
              selects={selects}
              selectsDebouncer={selectsDebouncer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [selects, selectsDebouncer] = useDebouncedValue<Selects>(
    {},
    { wait: 400 },
  );

  const root: Bookmark = {
    id: "root",
    title: "Root",
    children: [
      {
        id: "1",
        title: "Bookmark 1",
        children: [
          {
            id: "11",
            title: "Bookmark 11",
            children: [
              { id: "111", title: "Bookmark 111", children: [] },
              { id: "112", title: "Bookmark 112", children: [] },
            ],
          },
          { id: "12", title: "Bookmark 12", children: [] },
        ],
      },
      {
        id: "2",
        title: "Bookmark 2",
        children: [
          { id: "21", title: "Bookmark 21", children: [] },
          { id: "22", title: "Bookmark 22", children: [] },
        ],
      },
      {
        id: "3",
        title: "Bookmark 3",
        children: [
          { id: "31", title: "Bookmark 31", children: [] },
          { id: "32", title: "Bookmark 32", children: [] },
        ],
      },
      {
        id: "4",
        title: "Bookmark 4",
        children: [
          { id: "41", title: "Bookmark 41", children: [] },
          { id: "42", title: "Bookmark 42", children: [] },
        ],
      },
      {
        id: "5",
        title: "Bookmark 5",
        children: [
          { id: "51", title: "Bookmark 51", children: [] },
          { id: "52", title: "Bookmark 52", children: [] },
        ],
      },
      {
        id: "6",
        title: "Bookmark 6",
        children: [
          { id: "61", title: "Bookmark 61", children: [] },
          { id: "62", title: "Bookmark 62", children: [] },
        ],
      },
    ],
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-2">
        <Item
          level={0}
          bookmark={root}
          selects={selects}
          selectsDebouncer={selectsDebouncer}
        />
      </div>
    </div>
  );
}
