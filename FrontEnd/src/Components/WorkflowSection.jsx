import { FaSearch, FaComments, FaCheckCircle } from "react-icons/fa";

function WorkflowSection() {
  return (
    <div className="bg-black text-white px-6 py-20 mt-10">

      {/* ================= TITLE ================= */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-bold">
          Precision Workflow
        </h1>
        <p className="text-gray-400 mt-4">
          From consultation to resolution in three elegant steps.
        </p>
      </div>

      {/* ================= STEPS ================= */}
      <div className="relative max-w-6xl mx-auto">

        {/* LINE */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] bg-gray-700"></div>

        <div className="grid md:grid-cols-3 gap-12 text-center relative">

          {/* STEP 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-yellow-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <FaSearch className="text-yellow-400 text-xl" />
            </div>

            <h3 className="text-lg font-semibold">Discovery</h3>

            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Filter by expertise, location, and real-time availability
              to find your ideal match.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-yellow-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <FaComments className="text-yellow-400 text-xl" />
            </div>

            <h3 className="text-lg font-semibold">Consultation</h3>

            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Secure, end-to-end encrypted sessions with integrated
              communication and document sharing.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-yellow-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <FaCheckCircle className="text-yellow-400 text-xl" />
            </div>

            <h3 className="text-lg font-semibold">Resolution</h3>

            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Receive your professional summary, prescription, or
              legal roadmap instantly.
            </p>
          </div>

        </div>
      </div>

      {/* ================= CTA SECTION ================= */}
      <div className="mt-20 flex justify-center">

        <div className="w-full max-w-4xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-black rounded-3xl p-10 md:p-14 text-center shadow-[0_30px_100px_rgba(250,204,21,0.4)]">

          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready for expert clarity?
          </h2>

          <p className="text-sm md:text-base mb-8 max-w-xl mx-auto">
            Join thousands of users who trust Cure & Counsel for their most
            important health and legal decisions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <button className="px-6 py-3 bg-black text-yellow-400 font-semibold rounded-md border border-black hover:scale-105 transition">
              Get Started Now
            </button>

            <button className="px-6 py-3 bg-transparent border border-black text-black font-semibold rounded-md hover:bg-black hover:text-yellow-400 transition">
              View Pricing
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default WorkflowSection;