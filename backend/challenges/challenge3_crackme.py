#!/usr/bin/env python3
"""
CRACKME v1.0 - Reverse Engineering Challenge
=============================================

This program checks for the correct license key.
Your mission: Find the hidden flag!

The key is encoded in the binary data below.
Reverse engineer the validation logic to find the flag.

HINT: The hex values spell out something interesting...
"""

# Encoded license key (hex values)
LICENSE_DATA = [
    0x43, 0x54, 0x46, 0x7B,
    0x72, 0x33, 0x76, 0x33,
    0x72, 0x73, 0x33, 0x5F,
    0x6D, 0x61, 0x73, 0x74,
    0x33, 0x72, 0x7D
]

def check_license(user_input):
    """
    Validates the license key.
    The correct key is hidden in LICENSE_DATA as ASCII values.
    """
    # Convert hex to ASCII to get the flag
    correct_key = ''.join([chr(x) for x in LICENSE_DATA])
    
    if user_input == correct_key:
        return True
    return False

def show_hint():
    """Shows a hint for stuck players"""
    print("\n💡 HINT: The numbers... what do they mean?")
    print("   Maybe they are not just random hex values.")
    print("   Standard ASCII encoding might be key here.")

def main():
    print("=" * 50)
    print("      CRACKME v1.0 - License Validator")
    print("=" * 50)
    print("\nAnalyze the LICENSE_DATA to find the flag!")
    print("The hex values contain the secret...\n")
    
    # Show the hex data for analysis
    print("LICENSE_DATA (hex):")
    hex_str = ' '.join([f'0x{x:02X}' for x in LICENSE_DATA])
    print(f"  {hex_str}\n")
    
    while True:
        print("\nOptions:")
        print("  1. Enter license key")
        print("  2. Show hint")
        print("  3. Exit")
        
        choice = input("\nChoice: ").strip()
        
        if choice == '1':
            key = input("Enter license key: ").strip()
            if check_license(key):
                print("\n🎉 CORRECT! License validated!")
                print(f"🚩 FLAG: {key}")
                break
            else:
                print("\n❌ Invalid license key. Keep trying!")
                
        elif choice == '2':
            show_hint()
            
        elif choice == '3':
            print("\nGoodbye!")
            break
        else:
            print("Invalid option")

if __name__ == "__main__":
    main()
