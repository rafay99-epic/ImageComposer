export default async function handler(req, res) {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    return res
      .status(500)
      .json({ error: "Replicate API token not configured" });
  }

  try {
    if (req.method === "POST") {
      // Start a new prediction
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.detail || "Failed to start prediction",
          details: errorData,
        });
      }

      const data = await response.json();
      return res.status(response.status).json(data);
    } else if (req.method === "GET") {
      // Get prediction status
      const predictionId = req.query.id;
      if (!predictionId) {
        return res.status(400).json({ error: "Prediction ID is required" });
      }

      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.detail || "Failed to get prediction status",
          details: errorData,
        });
      }

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Replicate API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
