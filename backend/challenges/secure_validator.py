import base64

def check_license(key):
    # Length Check
    if len(key) != 18:
        return False
    
    # Format Check
    if not (key.startswith("PHISH{") and key.endswith("}")):
        return False
    
    # Content Extraction: PHISH{...}
    content = key[6:-1]
    
    # Split by underscore
    parts = content.split('_')
    if len(parts) != 3:
        return False
    
    # Part 1 Validation: Simple XOR
    p1 = parts[0]
    expected_p1 = [88, 57, 124]
    if len(p1) != 3: return False
    for i in range(3):
        if ord(p1[i]) ^ 10 != expected_p1[i]:
            return False
            
    # Part 2 Validation: Reverse String
    p2 = parts[1]
    if p2[::-1] != "gnE":
        return False
        
    # Part 3 Validation: Base64
    p3 = parts[2]
    if base64.b64encode(p3.encode()).decode() != "VzFu":
        return False
        
    return True

def main():
    print("========================================")
    print("   SECURE LICENSE TERMINAL v2.0         ")
    print("========================================")
    user_input = input("Enter License Key: ")
    
    if check_license(user_input):
        print("\n[SUCCESS] Access Granted.")
        print(f"[INFO] The flag is: {user_input}")
    else:
        print("\n[ERROR] Invalid License Key.")
        print("Access Denied.")

if __name__ == "__main__":
    main()
