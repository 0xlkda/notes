```
The system currently has ~160M follows records for ~5.5M users. If we were to store each of these follows in a pair of HashMaps (one to lookup by the actor, one to lookup by the subject) how much memory would we need?
```

To estimate the memory needed to store ~160 million follows records for ~5.5 million users using pairs of HashMaps (one for lookup by the actor and one for lookup by the subject), we'll break down the calculation into several parts:

1. **Memory per Entry in a HashMap**: Each entry in a HashMap typically consists of:
   - A key (reference to the key object)
   - A value (reference to the value object)
   - A hash value
   - A next pointer (for handling collisions)

   Assuming we're using Java-like HashMap implementation:
   - Reference to key object: 8 bytes (assuming a 64-bit system)
   - Reference to value object: 8 bytes
   - Hash value: 4 bytes
   - Next pointer: 8 bytes
   - Total per entry overhead: 28 bytes

2. **Memory for Keys and Values**:
   - Keys and values are references to objects. If we assume each user is represented by an integer (4 bytes), and given we have two maps (one by actor and one by subject), each follow relationship is stored twice.
   - For the key-value pairs, the memory for each follow relationship in one map would be:
     - Key (actor or subject): 4 bytes
     - Value (subject or actor): 4 bytes

3. **Total Memory for Entries**:
   - Each follow relationship will be stored in two HashMaps, so the memory required for each follow in terms of key-value pairs is:
     - Memory per entry in one map: 28 bytes (overhead) + 4 bytes (key) + 4 bytes (value) = 36 bytes
     - Total for both maps: 36 bytes * 2 = 72 bytes

4. **Total Memory for All Follows**:
   - Number of follow relationships: 160 million
   - Total memory for all follows: 160,000,000 * 72 bytes = 11,520,000,000 bytes

5. **HashMap Overhead**:
   - HashMaps also have an internal structure (buckets array). The size of the buckets array depends on the initial capacity and the load factor.
   - Assume a load factor of 0.75 and initial capacity of 160 million / 0.75 = ~213 million entries for each map.

   - Size of the buckets array: 213 million * 8 bytes (reference to an entry) = 1,704,000,000 bytes per map
   - Total for two maps: 1,704,000,000 * 2 = 3,408,000,000 bytes

6. **Total Memory Calculation**:
   - Memory for entries: 11,520,000,000 bytes
   - Memory for buckets array: 3,408,000,000 bytes
   - Total memory: 11,520,000,000 bytes + 3,408,000,000 bytes = 14,928,000,000 bytes

### Conclusion
The total memory required to store ~160 million follows records for ~5.5 million users in pairs of HashMaps (one for lookup by the actor and one for lookup by the subject) would be approximately **14.93 GB**.
