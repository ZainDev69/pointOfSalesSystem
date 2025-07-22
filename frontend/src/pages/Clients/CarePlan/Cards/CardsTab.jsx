import { FileText, User, Calendar, Clock, Target } from "lucide-react";

export function CardsTab({ activeCarePlan, outcomes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
      {/* Version Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
        <div>
          <p className="text-lg font-bold text-blue-900 mb-0.5">
            v{activeCarePlan.version}
          </p>
          <p className="text-xs text-blue-700 font-medium">Version</p>
        </div>
        <FileText className="w-5 h-5 text-blue-500" />
      </div>
      {/* Assessed By Card */}
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
        <div>
          <p className="text-lg font-bold text-cyan-900 mb-0.5">
            {activeCarePlan.assessedBy || "-"}
          </p>
          <p className="text-xs text-cyan-700 font-medium">Assessed By</p>
        </div>
        <User className="w-5 h-5 text-cyan-500" />
      </div>
      {/* Assessment Date Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
        <div>
          <p className="text-lg font-bold text-green-900 mb-0.5">
            {new Date(activeCarePlan.assessmentDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-green-700 font-medium">Assessment Date</p>
        </div>
        <Calendar className="w-5 h-5 text-green-500" />
      </div>
      {/* Review Due Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
        <div>
          <p className="text-lg font-bold text-purple-900 mb-0.5">
            {new Date(activeCarePlan.reviewDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-purple-700 font-medium">Review Due</p>
        </div>
        <Clock className="w-5 h-5 text-purple-500" />
      </div>
      {/* Outcomes Card */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
        <div>
          <p className="text-lg font-bold text-amber-900 mb-0.5">
            {outcomes.length}
          </p>
          <p className="text-xs text-amber-700 font-medium">Outcomes</p>
        </div>
        <Target className="w-5 h-5 text-amber-500" />
      </div>
    </div>
  );
}
