import db from "@/lib/db";
import Table from "@/components/Table"; // adjust path if needed

export default async function Page() {
  // fetch data from database
  const [rows] = await db.query("SELECT * FROM admin");

  // define table columns
  const columns = [
    { key: "id", header: "ID" },
    { key: "email", header: "Email" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Admin Users</h1>

      {/* pass data into your Table */}
      <Table columns={columns} data={rows as any[]} />
    </div>
  );
}