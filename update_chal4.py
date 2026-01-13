
import os

message = """This is Alpha Team Leader.
We have successfully infiltrated the Phishermen network perimeter.
We found the last evidence needed to bring them down for good.
It is hidden deep within the Phishermen's HQ.
We are moving to intercept the target now.
This is where we stand our ground.
Over and Out."""

hex_stream = ' '.join([f'{ord(c):02X}' for c in message])

content = f"""================================================
    NETWORK FORENSICS - INTERCEPTED COMMUNICATION
================================================
CLASSIFIED: TOP SECRET
CASE FILE: #NF-2024-FINAL
ANALYST: Agent 47

SITUATION:
----------
We intercepted a high-frequency burst transmission from Alpha Team
just before they went radio silent.
This was their final report on the Phishermen terrorist group.

The transmission is protected by high-level encryption.
It appears to represent critical intelligence regarding the
Phishermen's Head Quarters (HQ).

INTERCEPTED HEX STREAM:
========================

{hex_stream}

------------------------

BRIEFING:
Alpha Team has gone dark.
Follow their trail. Find the source of the problem.
End of the road, Agent 47. Expect resistance.

================================================
"""

file_path = 'backend/challenges/level4_transmission.txt'
with open(file_path, 'w') as f:
    f.write(content)

print(f"Created {file_path}")
