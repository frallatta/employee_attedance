const HeaderTable = function ({ headerTitle }: { headerTitle: string }) {
  return (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-lg text-900 font-bold">{headerTitle}</span>
    </div>
  );
};

export {HeaderTable}
