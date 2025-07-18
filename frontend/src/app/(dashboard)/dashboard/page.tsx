import React from "react";
import { Home, Users, Search, PhoneCall, Star } from "lucide-react"; // Importing icons from lucide-react

// Main App component
const App = () => {
  return (
    <div className="flex h-screen overflow-hidden font-inter">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
        {/* Header Component */}
        <Header />

        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Hello Seyi 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Welcome to your space for growth, connect, learn, and thrive with
            like-minded entrepreneurs.
          </p>
        </section>

        {/* Active Connections Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Active Connections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Connection Cards */}
            <ConnectionCard
              imgSrc="/assets/cody.png"
              name="Cody Fisher"
              role="Product designer"
              connections="500+"
              isMentor={true}
            />
            <ConnectionCard
              imgSrc="/assets/devon.png"
              name="Devon Lane"
              role="Product designer"
              connections="900+"
              isMentor={true}
            />
            <ConnectionCard
              imgSrc="/assets/cameron.png"
              name="Cameron Williamson"
              role="Product designer"
              connections="500+"
              isMentor={true}
            />
            <ConnectionCard
              imgSrc="/assets/theresa.png"
              name="Theresa Webb"
              role="Product designer"
              connections="500+"
              isMentor={true}
            />
          </div>
        </section>

        {/* Active Users Section */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            <button className="py-3 px-6 text-blue-600 font-semibold border-b-2 border-blue-600 whitespace-nowrap">
              Active Users
            </button>
            <button className="py-3 px-6 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300 whitespace-nowrap">
              Connection Request
            </button>
            <button className="py-3 px-6 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300 whitespace-nowrap">
              Sent Requests
            </button>
            <button className="py-3 px-6 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300 whitespace-nowrap">
              Pending Requests
            </button>
          </div>

          {/* User List/Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Followers
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Following
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* User Rows */}
                <UserRow
                  imgSrc="/assets/eleanor.png"
                  name="Eleanor Pena"
                  title="Certified Data Analyst"
                  role="Mentee"
                  followers="20 Followers"
                  following="25 Following"
                />
                <UserRow
                  imgSrc="/assets/ralph.png"
                  name="Ralph Edwards"
                  title="Certified Data Analyst"
                  role="Mentee"
                  followers="20 Followers"
                  following="25 Following"
                />
                <UserRow
                  imgSrc="/assets/raplh-1.png"
                  name="Ralph Edwards"
                  title="Certified Data Analyst"
                  role="Mentor"
                  followers="20 Followers"
                  following="25 Following"
                />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => (
  <aside className="w-64 bg-card p-6 flex flex-col shadow-lg rounded-r-2xl">
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-primary">Lynqup.</h1>
    </div>
    <nav>
      <ul>
        <li className="mb-4">
          <a
            href="#"
            className="flex items-center p-3 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            <Home className="mr-3" size={20} /> {/* Lucide icon */}
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center p-3 rounded-xl text-muted-foreground hover:bg-muted"
          >
            <Users className="mr-3" size={20} /> {/* Lucide icon */}
            Groups
          </a>
        </li>
      </ul>
    </nav>
  </aside>
);

// Header Component
const Header = () => (
  <header className="flex justify-between items-center mb-8">
    <div className="relative w-96">
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />{" "}
      {/* Lucide icon */}
    </div>
    <div className="flex items-center">
      <img
        src="/assets/home-avatar.png"
        alt="User Profile"
        className="w-10 h-10 rounded-full border-2 border-blue-400"
      />
    </div>
  </header>
);

// Connection Card Component
type ConnectionCardProps = {
  imgSrc: string;
  name: string;
  role: string;
  connections: string;
  isMentor: boolean;
};

const ConnectionCard = ({
  imgSrc,
  name,
  role,
  connections,
  isMentor,
}: ConnectionCardProps) => (
  <div className="bg-card p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
    <img
      src={imgSrc}
      alt={name}
      className="w-20 h-20 rounded-full mb-4 border-2 border-chart-1"
    />
    <p className="text-muted-foreground text-sm mb-1">
      {connections} Connections
    </p>
    {isMentor && (
      <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-2">
        <Star className="inline-block mr-1" size={12} fill="currentColor" />{" "}
        Mentor
      </span>
    )}
    <h4 className="text-lg font-semibold text-foreground">{name}</h4>
    <p className="text-muted-foreground text-sm mb-4">{role}</p>
    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition duration-300 flex items-center">
      <PhoneCall className="mr-2" size={16} /> Schedule Call
    </button>
  </div>
);

// User Row Component for the table
type UserRowProps = {
  imgSrc: string;
  name: string;
  title: string;
  role: string;
  followers: string;
  following: string;
};

const UserRow = ({
  imgSrc,
  name,
  title,
  role,
  followers,
  following,
}: UserRowProps) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img
          src={imgSrc}
          alt={name}
          className="w-10 h-10 rounded-full mr-3 border-2 border-chart-2"
        />
        <div>
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          role === "Mentor"
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
      {followers}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
      {following}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition duration-300">
        Connect
      </button>
    </td>
  </tr>
);

export default App;
