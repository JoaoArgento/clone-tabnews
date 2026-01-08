import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 200,
  });

  let updatedAt = "carregando...";
  let databaseDependencies = "Obtendo dados...";

  if (!isLoading) {
    updatedAt = new Date(data.updated_at).toLocaleString();
    databaseDependencies = data.dependencies.database;
  }

  return (
    <div>
      <p>Ultima atualização: {updatedAt}</p>
      <p>Versão do banco: {databaseDependencies.version} </p>
      <p>Conexões do banco: {databaseDependencies.open_connections} </p>
      <p>Máximo de conexões: {databaseDependencies.max_connections} </p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Alo</h1>
      <UpdatedAt />
    </>
  );
}
