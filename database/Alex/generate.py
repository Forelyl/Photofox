import random
images = [
    "(6,'https://www.dropbox.com/scl/fi/87wzv5c3we5llehc1fgpk/2024-05-28-12-52-15.582154-00-00-3.jpg?rlkey=ko3a7qjgnwqgtf8yx0b7nkvfs&raw=1','/6/2024-05-28 12:52:15.582154+00:00|3.jpg','Anime girl','',false,'2024-05-28',693,1232),",
    "(6,'https://www.dropbox.com/scl/fi/empihyjksrwhtv09qk66m/2024-05-28-12-41-31.110354-00-00-1.jpg?rlkey=5yc8pjovnwf389refjzhb5sj5&raw=1','/6/2024-05-28 12:41:31.110354+00:00|1.jpg','Sky and mountain','A vibrant digital painting featuring a snow-capped mountain under a swirling, starry sky. The sky transitions from twilight to night, with luminous clouds and twinkling stars creating a magical atmosphere.',false,'2024-05-28',564,1222),",
    "(6,'https://www.dropbox.com/scl/fi/0kqem3k5zc8z2qqqlsejp/2024-05-28-12-43-43.317581-00-00-5.jpg?rlkey=ry5gbi7knjkk21wnw9q2i2e2m&raw=1','/6/2024-05-28 12:43:43.317581+00:00|5.jpg','Warrior on horse','A pixel art depiction of a knight in shining armor mounted on a horse. The knight holds a lance, and a red cape flows dramatically behind him. The background features rolling green hills and a bright, cloudy sky.',false,'2024-05-28',736,1308),",
    "(6,'https://www.dropbox.com/scl/fi/batyxqcgvq9culajuivll/2024-05-28-12-42-31.272411-00-00-2.jpg?rlkey=td79cq7po2ow7aq55i4bh2dnf&raw=1','/6/2024-05-28 12:42:31.272411+00:00|2.jpg','Red sakura on mountain','A landscape with a gnarled tree adorned with bright red leaves, perched on a rocky cliff. Misty mountains and foggy valleys create a serene, mystical backdrop.',false,'2024-05-28',564,977),",
    "(6,'https://www.dropbox.com/scl/fi/7osgtdw68v9nl2k5jaikj/2024-05-28-12-43-16.823040-00-00-4.jpg?rlkey=k3ua9fbwyf3kcnnk5d6rbzv8x&raw=1','/6/2024-05-28 12:43:16.823040+00:00|4.jpg','Kitty cat','A close-up of a cute black cat peering through a narrow opening. Its large, expressive eyes are filled with curiosity, and the detailed fur texture gives it a lifelike appearance.',false,'2024-05-28',564,1006),",
    "(6,'https://www.dropbox.com/scl/fi/2zrje1okoi8z4tmj3elt9/2024-05-28-14-07-52.641525-00-00-7.jpg?rlkey=xf4eskfnmexlwa71v2cdu8fmq&raw=1','/6/2024-05-28 14:07:52.641525+00:00|7.jpg','Cloudy sky','The partly cloudy sky reflects on the water’s surface, creating a tranquil and picturesque scene. The vibrant colors and sense of calmness make this image captivating. 🌿🌼🌤️',false,'2024-05-28',1024,676),",
    "(6,'https://www.dropbox.com/scl/fi/9s6vxjh9snig4359akx3n/2024-05-28-14-14-38.924942-00-00-8.jpg?rlkey=98wtgtt622jj7l2cekgfye9qk&raw=1','/6/2024-05-28 14:14:38.924942+00:00|8.jpg','Detailed fantasy landscape','The image depicts a detailed fantasy landscape with towering mountains, cascading waterfalls, and a variety of terrains including coastal areas, valleys, and plateaus. There are structures resembling castles and towers, connected by winding paths. The scenery is enveloped in a soft haze that adds to the mystical ambiance of the artwork.',false,'2024-05-28',827,464),",
    "(6,'https://www.dropbox.com/scl/fi/c9lk6bv3o6mvnlw2zp8w3/2024-05-28-14-16-57.578889-00-00-9.jpg?rlkey=rnklbzzm9dxym09ffza33j2cg&raw=1','/6/2024-05-28 14:16:57.578889+00:00|9.jpg','Towering Mountains','Snow-capped peaks pierce the sky, their jagged edges hinting at ancient secrets. These mountains guard the realm, their slopes shrouded in mystery.',false,'2024-05-28',827,464),",
    "(6,'https://www.dropbox.com/scl/fi/r0y0aoyiixelgd6l437e6/2024-05-28-14-21-39.069907-00-00-10.jpg?rlkey=8tniopwodrkpv2ea93f7b2vn7&raw=1','/6/2024-05-28 14:21:39.069907+00:00|10.jpg','Ancient tree','The sprawling ancient tree stands like a wise old guardian, its gnarled branches reaching out over the quaint stone bridge. The bridge, with its graceful arch, spans a gentle stream.',false,'2024-05-28',827,473),"
]
AMOUNT_OF_ROUNDS = 20
start_text = 'INSERT INTO image(author_id, image_url, dropbox_path, title, description, download_permission, adding_date, width, height) VALUES'

def cool_shuffle(rounds: int, images: list[str]):
    result = list()
    for i in range(rounds):
        random.shuffle(images)
        for x in images:
            result.append(x)
    return result
    
def print_and_shuffle (rounds: int, images: list[str]):
    print(start_text)
    for x in cool_shuffle(rounds, images):
        print(x)
        
print_and_shuffle(AMOUNT_OF_ROUNDS, images)