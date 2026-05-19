export default function CategoryBar() {

  return (
    <div className="border-t border-gray-700 bg-gray-800">

      <div className="max-w-6xl mx-auto px-6 py-3 flex gap-6 text-sm text-gray-300 overflow-x-auto">

        <span className="hover:text-sky-300 cursor-pointer whitespace-nowrap">
          🔥 Nổi bật
        </span>

        <span className="hover:text-sky-300 cursor-pointer whitespace-nowrap">
          🎤 Âm nhạc
        </span>

        <span className="hover:text-sky-300 cursor-pointer whitespace-nowrap">
          💻 Công nghệ
        </span>

        <span className="hover:text-sky-300 cursor-pointer whitespace-nowrap">
          🎓 Workshop
        </span>

      </div>
    </div>
  );
}