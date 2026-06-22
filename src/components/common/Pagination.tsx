const Pagination = ({
  currentPage,
  totalItem,
  limit,
  onPageChange,
}: {
  currentPage: number;
  totalItem: number;
  limit: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPage = Math.ceil(totalItem / limit);
  const pageNumbers = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers);
  return (
    <div className="flex justify-center items-center mt-8 mb-4 gap-6">
      <button
        className="bg-primary text-white px-2 py-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {pageNumbers?.map((num) => (
        <button
          key={num}
          className={`px-2 py-1 border border-primary ${
            currentPage === num ? "bg-primary text-white" : ""
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="bg-primary px-2 py-1 text-white"
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
