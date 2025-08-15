import React from "react";
import { LogOut } from "lucide-react";

interface HeaderProps {
  admin: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ admin, onLogout }) => (
  <header
    className="border-b"
    style={{
      background: "rgba(139, 69, 19, 0.9)",
      backdropFilter: "blur(15px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    }}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">JAI</span>
          </div>
          <h1 className="ml-4 text-2xl font-bold text-white">
            Painel Administrativo
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-orange-100 font-medium">
            Olá, {admin?.name || admin?.email || "Admin"}
          </span>
          <button
            onClick={onLogout}
            className="text-orange-200 hover:text-white transition-colors flex items-center space-x-2 bg-orange-600 bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
