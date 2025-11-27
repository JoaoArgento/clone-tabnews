import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1+1 as sum;")
  //console.log();
  response.status(200).json({ message: "eu sou incriveeel!" });
}

export default status;
