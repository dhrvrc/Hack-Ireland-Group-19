from typing import Optional

from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response

from .services.fetch_llm_response_service import FetchLlmResponseService


class PromptsViewSet(viewsets.ViewSet):
    """
    A viewset for handling prompt-related requests.
    """
    service: Optional[FetchLlmResponseService]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.service = FetchLlmResponseService()

    def create(self, request):
        """
        Create a new prompt and return the generated response.
        """ 
        prompt_text = request.data.get("prompt", "")
        print("Received prompt:", prompt_text)
        
        response_text = self.service.fetch_response(prompt_text)
        print("Generated response:", response_text)
        if response_text is None:
            return Response({"error": "An error occurred while fetching the response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print("Response object:", Response({"response": response_text}, status=status.HTTP_200_OK))
        return Response({"response": response_text}, status=status.HTTP_200_OK)
