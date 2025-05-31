import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the request to pumpportal.fun
    const response = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // If response is binary (for transaction), return as arrayBuffer
    if (response.headers.get("content-type")?.includes("application/octet-stream")) {
      const data = await response.arrayBuffer();
      return new NextResponse(data, {
        status: response.status,
        headers: {
          "Content-Type": "application/octet-stream"
        }
      });
    }

    // Otherwise return as JSON
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in trade API:', error);
    return NextResponse.json(
      { error: 'Failed to process trade request' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 