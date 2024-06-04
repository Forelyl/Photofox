import unittest

image_was_added_removed: bool = False
standard_token_is_ok: bool = True
import requests

def client_read_file(file_name: str) -> str:
    with open(f'backend/test/{file_name}', 'rb') as file:
        return str(file.read())
        

class Test(unittest.TestCase):

    def setUp(self):
        form_data = {
            'username': 'ff',
            'password': '4321'
        }
        r = requests.post("http://127.0.0.1:3000/login", data=form_data)
        self.token = r.json()['access_token']
        self.token_is_ok: bool = r.status_code == 200


    def test_add_delete_image(self):
        self.assertTrue(self.token_is_ok, 'Token was not gotten')
        print(self.token)
        image: str = client_read_file('2.jpg')
        form_data = {
            'title': 'tree',
            'description': 'red tree'
        }
        files = {'image': image}
        r = requests.post('http://127.0.0.1:3000/image', headers={'width':'564', 'height':'977', 'Authorization':f'Bearer {self.token}'},
                          files=files, data=form_data)


        self.image_id = int(r.json())
        self.assertGreaterEqual(self.image_id, 1)
        # ---------------------------------------------------------------

        r = requests.get("http://127.0.0.1:3000/image", params={'image_id': self.image_id})
        self.assertEqual(len(r.json()), 13)
        self.assertEqual(r.json()['id'], self.image_id)
        self.assertEqual(r.json()['title'], 'tree')

        # ---------------------------------------------------------------
        r = requests.delete("http://127.0.0.1:3000/image", headers={'image-id': f'{self.image_id}', 'Authorization':f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)

        # ---------------------------------------------------------------
        r = requests.get("http://127.0.0.1:3000/image", params={'image_id': self.image_id})
        print(r.status_code)
        self.assertEqual(r.status_code, 404)


    def test_add_remove_user(self):
        self.assertTrue(self.token_is_ok, 'Token was not gotten')
        new_user = {
            'login': 'bob',
            'password': '1234',
            'email': "bob@bob.bob"
        }

        r = requests.post("http://127.0.0.1:3000/profile/add/user", json=new_user)
        self.assertEqual(r.status_code, 200)
        bob_id: int = r.json()["access_token"]
        r = requests.patch("http://127.0.0.1:3000/profile/description", headers={'Authorization':f'Bearer {bob_id}',
                                                                                 'new-description': "Bob's account"})
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/profile", params={'login': 'bob'})
        self.assertEqual(r.status_code, 200)
        print(r.json())
        self.assertEqual(r.json()['description'], "Bob's account")

        r = requests.delete("http://127.0.0.1:3000/profile/delete", headers={'Authorization': f'Bearer {bob_id}'})
        self.assertEqual(r.status_code, 200)


    def test_add_remove_image_like(self):
        self.assertTrue(self.token_is_ok, 'Token was not gotten')
        image: str = client_read_file('2.jpg')
        form_data = {
            'title': 'tree',
            'description': 'red tree'
        }
        files = {'image': image}
        r = requests.post('http://127.0.0.1:3000/image', headers={'width':'564', 'height':'977', 'Authorization':f'Bearer {self.token}'},
                          files=files, data=form_data)
        self.assertEqual(r.status_code, 200)
        id = r.json()

        r = requests.post('http://127.0.0.1:3000/like', params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/image/user", params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'}).json()
        self.assertTrue(r['like_counter'] > 0 and r['is_liked'])

        r = requests.delete('http://127.0.0.1:3000/like', headers={'Authorization':f'Bearer {self.token}'}, params={'image_id':str(id)})
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/image/user", params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'}).json()
        self.assertTrue(r['like_counter'] == 0 and not r['is_liked'])

        r = requests.delete("http://127.0.0.1:3000/image", headers={'image-id': f'{id}', 'Authorization':f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)


    def test_add_remove_image_save(self):
        self.assertTrue(self.token_is_ok, 'Token was not gotten')
        image: str = client_read_file('2.jpg')
        form_data = {
            'title': 'tree',
            'description': 'red tree'
        }
        files = {'image': image}
        r = requests.post('http://127.0.0.1:3000/image', headers={'width':'564', 'height':'977', 'Authorization':f'Bearer {self.token}'},
                          files=files, data=form_data)
        self.assertEqual(r.status_code, 200)
        id = r.json()

        r = requests.post('http://127.0.0.1:3000/save/add', params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/image/user", params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'}).json()
        self.assertTrue(r['is_saved'])

        r = requests.delete('http://127.0.0.1:3000/save/delete', headers={'Authorization':f'Bearer {self.token}'}, params={'image_id':str(id)})
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/image/user", params={'image_id': id}, headers={'Authorization':f'Bearer {self.token}'}).json()
        self.assertTrue(not r['is_saved'])

        r = requests.delete("http://127.0.0.1:3000/image", headers={'image-id': f'{id}', 'Authorization':f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)

    def test_add_remove_users_subscribe(self):
        self.assertTrue(self.token_is_ok, 'Token was not gotten')
        new_user = {
            'login': 'bob',
            'password': '1234',
            'email': "bob@bob.bob"
        }
        r = requests.post("http://127.0.0.1:3000/profile/add/user", json=new_user)
        bob_token: str = r.json()['access_token']
        self.assertEqual(r.status_code, 200)

        r = requests.get("http://127.0.0.1:3000/profile", params={'login': 'bob'})
        bob_id: int = int(r.json()['id'])

        r = requests.get("http://127.0.0.1:3000/subscribe/get/on", params={'login': 'ff'})
        self.assertEqual(0, len(r.json()))
        self.assertEqual(r.status_code, 200)
        r = requests.get("http://127.0.0.1:3000/subscribe/get/by", params={'login': 'bob'})
        self.assertEqual(0, len(r.json()))
        self.assertEqual(r.status_code, 200)

        r = requests.post("http://127.0.0.1:3000/subscribe", params={'subscribe_on_id': bob_id}, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)
        r = requests.get("http://127.0.0.1:3000/subscribe/get/on", params={'login': 'ff'})
        self.assertEqual(1, len(r.json()))
        self.assertEqual(r.status_code, 200)
        r = requests.get("http://127.0.0.1:3000/subscribe/get/by", params={'login': 'bob'})
        self.assertEqual(1, len(r.json()))
        self.assertEqual(r.status_code, 200)

        r = requests.delete("http://127.0.0.1:3000/subscribe", params={'subscribed_on_id': bob_id}, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(r.status_code, 200)
        r = requests.get("http://127.0.0.1:3000/subscribe/get/on", params={'login': 'ff'})
        self.assertEqual(0, len(r.json()))
        self.assertEqual(r.status_code, 200)
        r = requests.get("http://127.0.0.1:3000/subscribe/get/by", params={'login': 'bob'})
        self.assertEqual(0, len(r.json()))
        self.assertEqual(r.status_code, 200)
        # ----------------------------------
        r = requests.delete("http://127.0.0.1:3000/profile/delete", headers={'Authorization': f'Bearer {bob_token}'})
        self.assertEqual(r.status_code, 200)




if __name__ == '__main__':
    unittest.main()
