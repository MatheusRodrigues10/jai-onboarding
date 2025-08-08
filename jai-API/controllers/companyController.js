const Company = require('../models/CompanyModel');

// Criar novo registro
exports.createCompany = async (req, res) => {
  try {
    console.log(req.body)
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por nome completo (exact match)
exports.getCompanyByNomeCompleto = async (req, res) => {
  try {
    const nome = req.params.nome;
    // Busca dentro do objeto company.nomeEmpresa exatamente igual a nome
    const company = await Company.findOne({ 'company.nomeEmpresa': nome });
    if (!company) return res.status(404).json({ error: 'Empresa não encontrada' });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
