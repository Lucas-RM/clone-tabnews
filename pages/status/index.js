import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const loadingText = "Carregando...";

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} loadingText={loadingText} />
      <DatabaseInfo
        isLoading={isLoading}
        data={data}
        loadingText={loadingText}
      />
    </>
  );
}

function UpdatedAt({ isLoading, data, loadingText }) {
  let updatedAtText = loadingText;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseInfo({ isLoading, data, loadingText }) {
  let version = loadingText;
  let maxConnections = loadingText;
  let openedConnections = loadingText;

  if (!isLoading && data) {
    version = data.dependencies.database.version;
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Banco de Dados</h2>
      <div>Versão do PostgreSQL: {version}</div>
      <div>Conexões disponíveis: {maxConnections}</div>
      <div>Conexões abertas: {openedConnections}</div>
    </>
  );
}
