interface PowerUpsProps {
  fiftyUsed: boolean;
  freezeUsed: boolean;
  hintUsed: boolean;
  onFifty: () => void;
  onFreeze: () => void;
  onHint: () => void;
}

export const PowerUps = ({ fiftyUsed, freezeUsed, hintUsed, onFifty, onFreeze, onHint }: PowerUpsProps) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button 
        onClick={onFifty}
        disabled={fiftyUsed}
        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-divide mr-2"></i>
        50:50
      </button>
      <button 
        onClick={onFreeze}
        disabled={freezeUsed}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-snowflake mr-2"></i>
        Đóng băng
      </button>
      <button 
        onClick={onHint}
        disabled={hintUsed}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-lightbulb mr-2"></i>
        Gợi ý
      </button>
    </div>
  );
};
