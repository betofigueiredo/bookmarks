import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  type Bookmark = {
    id: string;
    title: string;
  };

  const bookmarks = [{ id: "1", title: "Bookmark One" }] as Bookmark[];

  return (
    <div>
      <h1>About This Project</h1>
      <div>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id}>{bookmark.title}</div>
        ))}
      </div>
    </div>
  );
}
