import React, { useRef } from "react";

interface FileAttachmentProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onChange,
  label,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    onChange([...files, ...selectedFiles]);
    e.target.value = ""; // para poder selecionar o mesmo arquivo novamente se quiser
  };

  const removeFile = (indexToRemove: number) => {
    const filtered = files.filter((_, i) => i !== indexToRemove);
    onChange(filtered);
  };

  return (
    <div style={{ marginBottom: 24, marginTop: 10, color: "#eee" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "bold",
            color: "#eee",
          }}
        >
          {label}
        </label>
      )}

      {/* Input escondido */}
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Botão customizado */}
      <button
        type="button"
        onClick={handleButtonClick}
        style={{
          backgroundColor: "#111",
          border: "1px solid #444",
          color: "#eee",
          padding: "10px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 14,
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#222";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111";
        }}
      >
        Anexar arquivos
      </button>

      {/* Lista de arquivos em grid abaixo */}
      {files.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          {files.map((file, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                padding: 10,
                background: "#111",
                color: "#eee",
                borderRadius: 6,
                boxShadow: "0 0 8px rgba(0,0,0,0.8)",
                fontSize: 13,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: "default",
              }}
              title={file.name}
            >
              {file.name}
              <button
                onClick={() => removeFile(i)}
                type="button"
                aria-label={`Remover arquivo ${file.name}`}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "transparent",
                  border: "none",
                  color: "#f44336",
                  fontWeight: "bold",
                  fontSize: 18,
                  lineHeight: 1,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
