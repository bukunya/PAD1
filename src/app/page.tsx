import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Next.js Data Fetching
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              API vs Server Actions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn the difference between using API Routes with axios and Server
            Actions with Prisma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* API Route Approach */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                API Route Approach
              </h2>
              <p className="text-blue-100">Traditional REST API pattern</p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  How it works:
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      1
                    </span>
                    <span>Client makes HTTP request using axios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      2
                    </span>
                    <span>
                      Request routed to{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        /api/users
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      3
                    </span>
                    <span>API handler queries database with Prisma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      4
                    </span>
                    <span>JSON response sent to client</span>
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <span className="mr-2">✅</span> Pros
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Can be called from external apps</li>
                  <li>• Familiar REST pattern</li>
                  <li>• Easy to test with tools like Postman</li>
                  <li>• Works with any HTTP client</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span> Cons
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Extra HTTP overhead</li>
                  <li>• More boilerplate code</li>
                  <li>• Need to handle errors on both sides</li>
                  <li>• Separate endpoint for each operation</li>
                </ul>
              </div>

              <Link
                href="/api-approach"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
              >
                View Demo →
              </Link>
            </div>
          </div>

          {/* Server Action Approach */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Server Actions
              </h2>
              <p className="text-purple-100">Modern Next.js pattern</p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  How it works:
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      1
                    </span>
                    <span>
                      Client calls function marked with{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        &apos;use server&apos;
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      2
                    </span>
                    <span>Next.js automatically creates endpoint</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      3
                    </span>
                    <span>Function executes on server, queries Prisma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                      4
                    </span>
                    <span>Data automatically serialized and returned</span>
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <span className="mr-2">✅</span> Pros
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Less boilerplate code</li>
                  <li>• Type-safe end-to-end</li>
                  <li>• No manual API routes needed</li>
                  <li>• Better developer experience</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span> Cons
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Only works within Next.js app</li>
                  <li>• Can&apos;t be called from external apps</li>
                  <li>• Harder to test independently</li>
                  <li>• Requires Next.js 13+ App Router</li>
                </ul>
              </div>

              <Link
                href="/server-action"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
              >
                View Demo →
              </Link>
            </div>
          </div>
        </div>

        {/* CRUD Operations Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              🔧 Full CRUD Operations
            </h2>
            <p className="text-lg text-gray-600">
              See how to Create, Update, and Delete data with both approaches
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* API CRUD */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  API Routes CRUD
                </h3>
                <p className="text-blue-100">POST, GET, PATCH, DELETE methods</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Full CRUD with REST:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mr-2">POST</span>
                      <span>Create new users via axios.post()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mr-2">GET</span>
                      <span>Read users via axios.get()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold mr-2">PATCH</span>
                      <span>Update users via axios.patch()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold mr-2">DELETE</span>
                      <span>Delete users via axios.delete()</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Learn:</strong> See how HTTP methods map to CRUD operations, 
                    handle request/response cycles, and manage validation with REST APIs.
                  </p>
                </div>

                <Link
                  href="/api-crud"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
                >
                  Try API CRUD →
                </Link>
              </div>
            </div>

            {/* Server Actions CRUD */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-purple-200">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Server Actions CRUD
                </h3>
                <p className="text-purple-100">Direct server function calls</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Full CRUD with Actions:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mr-2">CREATE</span>
                      <span>createUserServerAction()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mr-2">READ</span>
                      <span>getUsersServerAction()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold mr-2">UPDATE</span>
                      <span>updateUserServerAction()</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold mr-2">DELETE</span>
                      <span>deleteUserServerAction()</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <strong>Learn:</strong> Call server functions directly like regular TypeScript 
                    functions. No HTTP knowledge needed, just async/await!
                  </p>
                </div>

                <Link
                  href="/server-crud"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
                >
                  Try Server CRUD →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            When to use which?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Use API Routes when:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Building a public API</li>
                <li>• Need webhook endpoints</li>
                <li>• External services need access</li>
                <li>• Working with mobile apps</li>
                <li>• Want traditional REST patterns</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Use Server Actions when:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Building internal features</li>
                <li>• Want better DX and type safety</li>
                <li>• Need form mutations</li>
                <li>• Only Next.js app will use it</li>
                <li>• Want less boilerplate</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-lg">
            <div className="bg-white rounded-lg px-8 py-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                💡 Pro Tip
              </h3>
              <p className="text-gray-600 max-w-2xl">
                You can use both in the same app! Use API routes for public
                endpoints and server actions for internal features. This gives
                you the best of both worlds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
