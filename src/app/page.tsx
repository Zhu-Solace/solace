"use client";

import { useEffect, useState, useMemo } from "react";
import { Advocate, ApiResponse, LoadingState } from "./types";
import Loader from "./components/Loader";
import Pill from "./components/Pill";
import { formatPhoneNumber } from "./utils";
import Specialties from "./components/Specialties";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setLoadingState("loading");

        const response = await fetch("/api/advocates");
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }

        const jsonResponse: ApiResponse<Advocate[]> = await response.json();

        // Handle API error responses
        if (jsonResponse.error) {
          throw new Error(jsonResponse.error);
        }

        if (!jsonResponse.data) {
          throw new Error("No data returned from API");
        }

        setAdvocates(jsonResponse.data);
        setLoadingState("success");
      } catch (error) {
        setLoadingState("error");
      }
    };

    fetchAdvocates();
  }, []);

  const filteredAdvocates = useMemo(() => {
    if (!searchTerm.trim()) {
      return advocates;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
        advocate.specialties.join(" ").toLowerCase().includes(lowerSearchTerm) ||
        advocate.yearsOfExperience.toString().includes(lowerSearchTerm)
      );
    });
  }, [advocates, searchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Solace Advocates</h1>
      <div className="mb-4 flex">
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
          placeholder="Search for an advocate"
          disabled={loadingState !== "success"}
          value={searchTerm}
        />
        <button disabled={loadingState !== "success"} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={onClick}>Reset Search</button>
      </div>
      {loadingState === "loading" && <Loader />}
      {loadingState === "success" && (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAdvocates.length} of {advocates.length} advocates
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Credentials
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Specialties
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdvocates.map((advocate: Advocate, index: number) => (
                    <tr
                      key={`${index}-advocate`}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {advocate.firstName} {advocate.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{advocate.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Pill>{advocate.degree}</Pill>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          <Specialties specialties={advocate.specialties} uniqueKey={`${index}-advocate`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? 'year' : 'years'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`tel:${advocate.phoneNumber}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          {formatPhoneNumber(advocate.phoneNumber)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {loadingState === "error" && <div>Error loading advocates</div>}
    </div>
  );
}
