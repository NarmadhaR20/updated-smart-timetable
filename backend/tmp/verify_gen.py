import urllib.request
import json
import collections

def verify_generation():
    url = "http://localhost:8000/api/generation/generate"
    payload = {
        "department_code": "BTECH IT",
        "year": 2,
        "semester": 4,
        "class_name": "B",
        "subject_allocations": []
    }
    
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                schedule = data.get('schedule', [])
                print(f"Total slots generated: {len(schedule)} / 42")
                
                # Check for Database Management Systems Laboratory (Contiguous check)
                dbms_lab_slots = [s for s in schedule if 'DATABASE MANAGEMENT SYSTEMS' in s['subject'].upper() and 'LAB' in s['subject'].upper()]
                print(f"\nDBMS Lab Check ({len(dbms_lab_slots)} slots):")
                if dbms_lab_slots:
                    by_day = collections.defaultdict(list)
                    for s in dbms_lab_slots: by_day[s['day']].append(s['period'])
                    
                    for day, periods in by_day.items():
                        periods.sort()
                        is_contiguous = all(periods[i] == periods[i-1] + 1 for i in range(1, len(periods)))
                        print(f" - {day}: Periods {periods} (Contiguous: {is_contiguous})")
                
                # Check for Tutorial Hours (DM 4+2=6, DAA 5, etc)
                print("\nHours Check:")
                counts = collections.Counter(s['subject'] for s in schedule)
                for sub, count in counts.items():
                    print(f" - {sub}: {count} hours")
                
                # Check for blanks
                print("\nBlank Slots:")
                all_slots = {(d, p) for d in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] for p in range(1, 8)}
                filled_slots = {(s['day'], s['period']) for s in schedule}
                blanks = sorted(list(all_slots - filled_slots))
                print(f"Found {len(blanks)} blank slots: {blanks}")

            else:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Request failed: {str(e)}")

if __name__ == "__main__":
    verify_generation()
