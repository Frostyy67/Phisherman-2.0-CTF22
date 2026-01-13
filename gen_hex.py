
text = """This is Alpha Team Leader.
We have successfully infiltrated the Phishermen network perimeter.
We found the last evidence needed to bring them down for good.
It is hidden deep within the Phishermen's HQ.
We are moving to intercept the target now.
This is where we stand our ground.
Over and Out."""
hex_output = ' '.join([f'{ord(c):02X}' for c in text])
print(hex_output)
with open('backend/challenges/hex_rpc.txt', 'w') as f:
    f.write(hex_output)
