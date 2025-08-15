import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, RefreshCw } from "lucide-react";
import Header from "./Header";
import CompanyCard from "./CompanyCard";
import CompanyDetailsModal from "./CompanyDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface DashboardProps {
  token: string;
  admin: any;
  onLogout: () => void;
}

const API_BASE = "http://localhost:5000/api";

const Dashboard: React.FC<DashboardProps> = ({ token, admin, onLogout }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyFiles, setCompanyFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(Array.isArray(data.companies) ? data.companies : []);
      } else if (response.status === 401) {
        onLogout();
      } else {
        console.error("Erro ao carregar empresas:", response.statusText);
        setCompanies([]);
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyFiles = async (companyId: string) => {
    try {
      const response = await fetch(`${API_BASE}/companies/${companyId}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanyFiles(Array.isArray(data.files) ? data.files : []);
      } else {
        console.error("Erro ao carregar arquivos:", response.statusText);
        setCompanyFiles([]);
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
      setCompanyFiles([]);
    }
  };

  const handleCompanyClick = async (company: any) => {
    if (!company || !company._id) return;

    setSelectedCompany(company);
    setModalOpen(true);
    await loadCompanyFiles(company._id);
  };

  const handleDeleteClick = (company: any) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${API_BASE}/companies/${companyToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        if (selectedCompany?._id === companyToDelete._id) {
          setSelectedCompany(null);
          setModalOpen(false);
        }

        setCompanyToDelete(null);
        setDeleteModalOpen(false);

        await loadCompanies();

        // Redireciona para página inicial após deletar
        navigate("/admin");
      } else {
        const data = await response.json();
        alert(`Erro ao deletar empresa: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
      alert("Erro de conexão ao deletar empresa");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCompanyDeleted = () => {
    loadCompanies();
    setModalOpen(false);
    setSelectedCompany(null);
  };

  useEffect(() => {
    loadCompanies();
  }, [token]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      }}
    >
      <Header admin={admin} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold text-white">
              Empresas Cadastradas
            </h2>
            <button
              onClick={loadCompanies}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              <span>{loading ? "Carregando..." : "Atualizar"}</span>
            </button>
          </div>

          {loading ? (
            <div className="text-white text-center py-16 text-xl">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              Carregando empresas...
            </div>
          ) : companies.length === 0 ? (
            <div
              className="text-center py-20 rounded-3xl"
              style={{
                background: "rgba(139, 69, 19, 0.6)",
                backdropFilter: "blur(15px)",
                border: "2px dashed rgba(255, 255, 255, 0.2)",
              }}
            >
              <Building2 className="w-16 h-16 mx-auto mb-6 text-orange-200 opacity-50" />
              <p className="text-orange-100 text-2xl font-medium">
                Nenhuma empresa cadastrada
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard
                  key={company._id || Math.random()}
                  company={company}
                  onClick={handleCompanyClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes da Empresa */}
      <CompanyDetailsModal
        company={selectedCompany}
        files={companyFiles}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        token={token}
        onCompanyDeleted={handleCompanyDeleted}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        companyName={
          companyToDelete?.company?.nomeEmpresa ||
          companyToDelete?.nomeEmpresa ||
          "Empresa sem nome"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
