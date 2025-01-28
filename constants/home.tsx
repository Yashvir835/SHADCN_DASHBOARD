import { FiDollarSign } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { FaBoxArchive } from "react-icons/fa6";
import { CiWavePulse1 } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { PiHandbag } from "react-icons/pi";
import { SiDigitalocean } from "react-icons/si";
import { FaDatabase } from "react-icons/fa6";
import { BiSolidUserDetail } from "react-icons/bi";

const iconMap1 = {
  dollar: <FiDollarSign />,
  person: <IoPersonOutline />,
  box: <FaBoxArchive />,
  wave: <CiWavePulse1 />,
};

export const homeData = [
  {
    id: 1,
    title: "Total Revenue",
    number: '$45,231.89',
    symbol: 'dollar',
    footer: '+20.1% from last month'
  },
  {
    id: 2,
    title: "Subscription",
    number: '2350',
    symbol: 'person',
    footer: '+180.1% from last month'
  },
  {
    id: 3,
    title: "Sales",
    number: '+12,234',
    symbol: 'box',
    footer: '+19% from last month'
  },
  {
    id: 4,
    title: "Active Now",
    number: '+573',
    symbol: 'wave',
    footer: '+201 since last hour'
  },
];

type IconMap = {
  [key: string]: JSX.Element;
};

export const iconMap: IconMap = {
  dashboard: <MdOutlineDashboard />,
  user: <BiSolidUserDetail />,
  billing: <FaBoxArchive />,
  avtar: <SiDigitalocean />,
  database: <FaDatabase />,
};

export const Navitems = [
  {
    title: 'Dashboard',
    url: "/",
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee', // This should be a route as a string
  //   icon: 'user',
  //   shortcut: ['e', 'e'],
  //   isActive: false,
  //   items: [],
  // },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [],
  // },
  {
    title: 'Knowledge Base',
    url: '/dashboard/KnowledgeBase',
    icon: 'database',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
  },
  {
    title: 'Customer Details',
    url: '/dashboard/CustomerDetails',
    icon: 'user',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
  },
  {
    title: 'Account',
    icon: 'billing',
    isActive: true,
    items: [
      // {
      //   title: 'Profile',
      //   url: '/dashboard/profile',
      //   shortcut: ['m', 'm'],
      // },
      // {
      //   title: 'Data Nexus',
      //   shortcut: ['l', 'l'],
      //   url: '/dashboard/DataNexus',
      // },
      {
        title: 'Upload Document',
        shortcut: ['l', 'l'],
        url: '/dashboard/UploadDocument',
      },
      {
        title: 'Add Customer',
        shortcut: ['l', 'l'],
        url: '/dashboard/AddCustomer',
      },
    ],
  },
  {
    title: 'Persona',
    url: '/dashboard/Persona',
    icon: 'avtar',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
  },
];
