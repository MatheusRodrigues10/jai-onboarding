const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const auth = require("../middleware/auth");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");

// Criar storage para GridFS usando a conexão mongoose já aberta
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({
          filename: filename,
          bucketName: "uploads",
          metadata: {
            companyId: req.params.id,
            originalName: file.originalname,
            uploadedBy: "anônimo",
            uploadDate: new Date(),
          },
        });
      });
    });
  },
});

// Configurar multer SEM limite de arquivos
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB por arquivo
  },
});

// ROTAS PÚBLICAS (sem autenticação)
router.post("/", companyController.createCompany); // Criar company
router.post("/:id/files", upload.array("files"), companyController.uploadFiles); // Upload arquivos
router.get("/:id/files/:filename", companyController.downloadFile); // Download arquivo

// ROTAS PROTEGIDAS (só admin com token)
router.get("/", auth, companyController.getCompanies); // Listar companies
router.get("/nome/:nome", auth, companyController.getCompanyByNomeCompleto); // Buscar por nome
router.get("/:id/files", auth, companyController.listFiles); // Listar arquivos
router.delete("/:id", companyController.deleteCompany) // Deleta empresa


module.exports = router;
