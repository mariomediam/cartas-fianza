// Tema personalizado para Flowbite React
// Adaptado a los colores institucionales de la Universidad Nacional de Frontera

const customTheme = {
  navbar: {
    root: {
      base: "bg-gradient-to-r from-primary-600 to-primary-700 px-2 py-2.5 sm:px-4",
      inner: {
        base: "mx-auto flex flex-wrap items-center justify-between",
      },
    },
    brand: {
      base: "flex items-center",
    },
    collapse: {
      base: "w-full md:block md:w-auto",
      list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
      hidden: {
        on: "hidden",
        off: "",
      },
    },
    link: {
      base: "block py-2 pr-4 pl-3 md:p-0",
      active: {
        on: "bg-primary-800 text-white md:bg-primary-800 md:text-white rounded",
        off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 md:border-0 md:text-primary-50 md:hover:bg-primary-500 md:hover:text-white",
      },
    },
    toggle: {
      base: "inline-flex items-center rounded-lg p-2 text-sm text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 md:hidden",
      icon: "h-6 w-6 shrink-0",
    },
  },
  dropdown: {
    floating: {
      target: "w-fit",
      base: "z-10 w-fit rounded divide-y divide-gray-100 shadow",
      animation: "transition-opacity",
      hidden: "invisible opacity-0",
      style: {
        auto: "border border-gray-200 bg-white text-gray-900",
      },
      content: "py-1 text-sm text-gray-700",
      divider: "my-1 h-px bg-gray-100",
      header: "block py-2 px-4 text-sm text-gray-700",
      item: {
        base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        icon: "mr-2 h-4 w-4",
      },
    },
  },
};

export default customTheme;

