import PdfFields from "@/compnents/PdfFields";

const Category1Page = ({ items }) => {
  return (
    <div>
      <h1>Category 1</h1>
      <PdfFields items={items} />
      {/* Add "Next" button to navigate to Category 2 */}
    </div>
  );
};

export default Category1Page;