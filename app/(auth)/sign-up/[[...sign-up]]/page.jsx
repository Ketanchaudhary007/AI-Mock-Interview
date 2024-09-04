import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="Login.png"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Register to AI MOCK INTERVIEWER
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              "Prepare for interview at easy like never before."
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 bg-black">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <img
                  src="Login.png"
                  alt="my responsive logo"
                  width={50}
                  height={50}
                />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Register to AI MOCK INTERVIEWER
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500 mb-10 text-justify">
                "Prepare for interview like never before"
              </p>
            </div>

            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-red-1 hover:bg-purple-600 border-none text-sm",
                },
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
}
