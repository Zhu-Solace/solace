# Solace Candidate Assignment - Discussion

## Overview

This coding challenge involved improving a basic advocate search application by fixing bugs, enhancing the UI/UX, and implementing performance optimizations. The application allows prospective patients to search through healthcare advocates based on various criteria.

## What I Would Have Done With More Time

### 1. Use the Database

I would have liked to fully implement the PostgreSQL database integration instead of relying on seed data. Most of my development time was spent learning and implementing Tailwind CSS for the UI redesign, which was valuable but meant I didn't get to complete the database setup. 

### 2. Advanced Performance Optimizations

- Implement caching strategies like redis or cache-control
- Database performance, add indexes where it makes sense, use limit/offset instead of slicing the data, get rid of the .includes 
