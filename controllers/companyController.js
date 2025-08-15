const Company = require("../models/CompanyModel");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridFSBucket;
const conn = mongoose.connection;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
  console.log('GridFSBucket inicializado com bucket "uploads"');
});

exports.createCompany = async (req, res) => {
  try {
    console.log("Criando nova company:", req.body.company?.nomeEmpresa);
    const company = new Company(req.body);
    await company.save();

    res.status(201).json({
      success: true,
      message: "Company criada com sucesso",
      id: company._id,
      company: company,
    });
  } catch (error) {
    console.error("Erro ao criar company:", error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ 'company.nomeEmpresa': 1 });
    console.log(`📋 Listando ${companies.length} companies`);

    res.status(200).json({
      success: true,
      count: companies.length,
      companies: companies,
    });
  } catch (error) {
    console.error("❌ Erro ao listar companies:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getCompanyByNomeCompleto = async (req, res) => {
  try {
    const nome = req.params.nome;
    const company = await Company.findOne({ "company.nomeEmpresa": nome });

    if (!company) {
      return res.status(404).json({
        error: "Empresa não encontrada",
      });
    }

    console.log(`🔍 Company encontrada: ${nome}`);
    res.status(200).json({
      success: true,
      company: company,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar company:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        error: "Company não encontrada",
      });
    }

    console.log(`🔍 Company encontrada por ID: ${company.company?.nomeEmpresa}`);
    res.status(200).json({
      success: true,
      company: company,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar company por ID:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID da company inválido",
      });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        error: "Company não encontrada",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Nenhum arquivo foi enviado",
      });
    }

    console.log(
      `📤 Upload de ${req.files.length} arquivo(s) para company: ${company.company?.nomeEmpresa || 'Nome não informado'}`
    );

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      contentType: file.contentType || file.mimetype,
      uploadDate: new Date(),
      companyId: id,
      downloadUrl: `/api/companies/${id}/files/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} arquivo(s) enviado(s) com sucesso`,
      files: uploadedFiles,
      companyName: company.company?.nomeEmpresa || 'Nome não informado',
    });
  } catch (error) {
    console.error("❌ Erro no upload:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor durante o upload",
      details: error.message
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { id, filename } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }

    console.log(`🔍 Buscando arquivo: ${filename} para company: ${id}`);

    // Primeiro, tentar buscar pelo filename exato
    let fileDoc = await conn.db.collection("uploads.files").findOne({
      filename: filename,
      "metadata.companyId": id,
    });

    // Se não encontrar, tentar buscar pelo nome original
    if (!fileDoc) {
      fileDoc = await conn.db.collection("uploads.files").findOne({
        "metadata.originalName": filename,
        "metadata.companyId": id,
      });
    }

    if (!fileDoc) {
      return res.status(404).json({ error: "Arquivo não encontrado", filename, companyId: id });
    }

    console.log(`📥 Download do arquivo: ${filename} da company: ${company.company?.nomeEmpresa || 'Nome não informado'}`);

    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    res.set("Content-Length", fileDoc.length);
    res.set(
      "Content-Disposition",
      `attachment; filename="${fileDoc.metadata?.originalName || fileDoc.filename}"`
    );

    const downloadStream = gridFSBucket.openDownloadStreamByName(filename);

    downloadStream.on("error", (error) => {
      console.error("❌ Erro no stream de download:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Erro durante o download", details: error.message });
      }
    });

    downloadStream.on("close", () => {
      console.log(`✅ Download concluído: ${filename}`);
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error("❌ Erro no download:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Erro interno do servidor durante o download",
        details: error.message
      });
    }
  }
};

exports.listFiles = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }

    console.log(`🔍 Listando arquivos para company: ${id} - ${company.company?.nomeEmpresa || 'Nome não informado'}`);

    const files = await conn.db.collection("uploads.files").find({ "metadata.companyId": id }).toArray();

    if (!files || files.length === 0) {
      console.log(`📋 Nenhum arquivo encontrado para company: ${company.company?.nomeEmpresa || 'Nome não informado'}`);
      return res.status(200).json({
        success: true,
        message: "Nenhum arquivo encontrado",
        files: [],
        companyName: company.company?.nomeEmpresa || 'Nome não informado',
        count: 0
      });
    }

    const fileList = files.map((file) => ({
      filename: file.filename,
      originalName: file.metadata?.originalName || file.filename,
      size: file.length,
      length: file.length,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
      // Usar o filename do GridFS para download, mas mostrar o nome original
      downloadUrl: `/api/companies/${id}/files/${file.filename}`,
    }));

    console.log(`📋 Listando ${files.length} arquivo(s) da company: ${company.company?.nomeEmpresa || 'Nome não informado'}`);

    res.status(200).json({
      success: true,
      count: files.length,
      files: fileList,
      companyName: company.company?.nomeEmpresa || 'Nome não informado',
    });
  } catch (error) {
    console.error("❌ Erro ao listar arquivos:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao listar arquivos",
      details: error.message
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id, filename } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }

    const fileDoc = await conn.db.collection("uploads.files").findOne({
      filename: filename,
      "metadata.companyId": id,
    });

    if (!fileDoc) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    await gridFSBucket.delete(fileDoc._id);

    console.log(`🗑️ Arquivo deletado: ${filename} da company: ${company.company?.nomeEmpresa || 'Nome não informado'}`);

    res.status(200).json({
      success: true,
      message: "Arquivo deletado com sucesso",
      filename,
      companyName: company.company?.nomeEmpresa || 'Nome não informado',
    });

  } catch (error) {
    console.error("❌ Erro ao deletar arquivo:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao deletar arquivo",
      details: error.message
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID da company inválido",
      });
    }

    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        error: "Company não encontrada",
      });
    }

    console.log(`📝 Company atualizada: ${company.company?.nomeEmpresa || 'Nome não informado'}`);

    res.status(200).json({
      success: true,
      message: "Company atualizada com sucesso",
      company: company,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar company:", error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    let files = []; // ✅ garante que a variável exista

    if (gridFSBucket) {
      files = await conn.db.collection("uploads.files").find({ "metadata.companyId": id }).toArray();

      for (const file of files) {
        try {
          await gridFSBucket.delete(file._id);
        } catch (err) {
          console.error(`Erro ao deletar arquivo ${file.filename}:`, err);
        }
      }
    }

    await Company.findByIdAndDelete(id);

    console.log(`🗑️ Company deletada: ${company.company?.nomeEmpresa || 'Nome não informado'} e ${files.length} arquivo(s)`);

    res.status(200).json({
      success: true,
      message: "Company e arquivos deletados com sucesso",
      companyName: company.company?.nomeEmpresa || 'Nome não informado',
      deletedFilesCount: files.length
    });
  } catch (error) {
    console.error("❌ Erro ao deletar company:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor ao deletar company",
      details: error.message
    });
  }
};