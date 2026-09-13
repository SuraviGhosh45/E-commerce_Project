
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available.",
  actions,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#292929] bg-[#111111]">
      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-[#292929] bg-[#151515]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500"
                >
                  {column.label}
                </th>
              ))}

              {actions && (
                <th className="px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-16 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-16 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? row._id ?? rowIndex}
                  className="border-b border-[#292929] last:border-b-0 transition hover:bg-[#151515]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-sm text-gray-300"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-[#292929] md:hidden">

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={row.id ?? row._id ?? rowIndex}
              className="p-5 transition hover:bg-[#151515]"
            >
              <div className="space-y-4">

                {columns.map((column) => (
                  <div
                    key={column.key}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
                      {column.label}
                    </span>

                    <div className="text-right text-sm text-gray-300">
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </div>
                  </div>
                ))}

                {actions && (
                  <div className="flex items-center justify-end gap-2 border-t border-[#292929] pt-4">
                    {actions(row)}
                  </div>
                )}

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default DataTable;

