docker build -t forelyl/photo-fox-backend:0.0.1 backend/.
docker push forelyl/photo-fox-backend:0.0.1

docker build -t forelyl/photo-fox-front:0.0.1 frontend/PhotoFox_front/.
docker push forelyl/photo-fox-front:0.0.1