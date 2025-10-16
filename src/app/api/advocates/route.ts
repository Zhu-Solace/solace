import { Advocate } from "@/app/types";
import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (limit < 1 || limit > 1000) {
      return Response.json(
        {
          error: "Invalid limit parameter. Must be between 1 and 1000.",
          code: "INVALID_LIMIT"
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (offset < 0) {
      return Response.json(
        {
          error: "Invalid offset parameter. Must be 0 or greater.",
          code: "INVALID_OFFSET"
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let data = advocateData.slice(offset, offset + limit);

    if (searchTerm && searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      data = data.filter((advocate: Advocate) => {
        return (
          advocate.firstName?.toLowerCase().includes(lowerSearchTerm) ||
          advocate.lastName?.toLowerCase().includes(lowerSearchTerm) ||
          advocate.city?.toLowerCase().includes(lowerSearchTerm) ||
          advocate.degree?.toLowerCase().includes(lowerSearchTerm) ||
          (Array.isArray(advocate.specialties) &&
            advocate.specialties.some((specialty: string) =>
              specialty.toLowerCase().includes(lowerSearchTerm)
            )) ||
          advocate.yearsOfExperience?.toString().includes(lowerSearchTerm)
        );
      });
    }

    return Response.json(
      {
        data,
        meta: {
          total: data.length,
          limit,
          offset,
          searchTerm: searchTerm || null
        }
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("API Error in /api/advocates:", error);

    return Response.json(
      {
        error: "Internal server error occurred while fetching advocates.",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}
