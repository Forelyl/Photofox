FROM python
WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 3000

RUN touch database_pass.data
RUN echo "eqhyq2g513" > database_pass.data

COPY . .
CMD ["granian", "--interface", "asgi", "--host", "0.0.0.0",  "--port", "3000", "API:app"]