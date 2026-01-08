import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function StatusInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 200,
  });

  let updatedAt = "carregando...";
  let databaseInfo = undefined;
  let databaseInfoVisual = "Obtendo dados...";

  if (!isLoading) {
    updatedAt = new Date(data.updated_at).toLocaleString();
    databaseInfo = data.dependencies.database;

    databaseInfoVisual = (
      <div>
        <p>Versão: {databaseInfo.version}</p>
        <p>Conexões: {databaseInfo.open_connections}</p>
        <p>Conexões máximas: {databaseInfo.open_connections}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Status</h1>
      <p>Ultima atualização: {updatedAt}</p>
      <h1>Database info</h1>
      <div>{databaseInfoVisual}</div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Alo</h1>
      <StatusInfo />
    </>
  );
}
