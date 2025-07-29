import { FileText, User, Calendar, Clock, Target } from "lucide-react";

// Helper to format date as 'YYYY-MM-DD, h:mm AM/PM'
const formatReviewDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
};

export function CardsTab({ activeCarePlan, outcomes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Version Card */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-slate-200/60 px-5 py-4 hover:shadow-xl hover:shadow-blue-100/40 hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[80px] shadow-lg shadow-slate-100/50 backdrop-blur-sm">
        <div>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            v{activeCarePlan.version}
          </p>
          <p className="text-sm text-slate-600 font-medium">Version</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Assessed By Card */}
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 rounded-2xl border border-slate-200/60 px-5 py-4 hover:shadow-xl hover:shadow-emerald-100/40 hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[80px] shadow-lg shadow-slate-100/50 backdrop-blur-sm">
        <div>
          <p className="text-xl font-bold text-slate-800 mb-1">
            {activeCarePlan.assessedBy || "-"}
          </p>
          <p className="text-sm text-slate-600 font-medium">Assessed By</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
          <User className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Assessment Date Card */}
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-violet-50 rounded-2xl border border-slate-200/60 px-5 py-4 hover:shadow-xl hover:shadow-purple-100/40 hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[80px] shadow-lg shadow-slate-100/50 backdrop-blur-sm">
        <div>
          <p className="text-lg font-bold text-slate-800 mb-1">
            {new Date(activeCarePlan.assessmentDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-600 font-medium">Assessment Date</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* Review Due Card */}
      <div className="bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 rounded-2xl border border-slate-200/60 px-5 py-4 hover:shadow-xl hover:shadow-amber-100/40 hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[80px] shadow-lg shadow-slate-100/50 backdrop-blur-sm">
        <div>
          <p
            className="text-base font-bold text-slate-800 mb-1 truncate"
            style={{ maxWidth: "140px" }}
          >
            {formatReviewDateTime(activeCarePlan.reviewDate)}
          </p>
          <p className="text-sm text-slate-600 font-medium">Review Due</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Outcomes Card */}
      <div className="bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 rounded-2xl border border-slate-200/60 px-5 py-4 hover:shadow-xl hover:shadow-rose-100/40 hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[80px] shadow-lg shadow-slate-100/50 backdrop-blur-sm">
        <div>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {outcomes.length}
          </p>
          <p className="text-sm text-slate-600 font-medium">Outcomes</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
          <Target className="w-6 h-6 text-rose-600" />
        </div>
      </div>
    </div>
  );
}
