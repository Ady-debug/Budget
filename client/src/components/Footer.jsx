const date = new Date();
const year = date.getFullYear();

export default function Footer() {
  return (
    <footer className="flex justify-center-safe">
      <div className="text-sm p-2 text-gray-900 dark:text-white">
        Adrian Soltan, ©{year}
      </div>
    </footer>
  );
}
