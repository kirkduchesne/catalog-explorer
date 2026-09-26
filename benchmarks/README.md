# Query microbenchmark

Run `npm run benchmark` on Node 20. The baseline is the query implementation captured before the search-text index and facet changes. Both functions operate on the same actual 24 authored records and must return identical results for every measured case.

One local run on Node v20.19.0 used 12 query combinations, nine alternating-order rounds, and 2400 evaluations per round. Median baseline time: 68.093 ms per round. Median current time: 6.614 ms per round (90.3% lower elapsed time in this run).

This measures repeated in-process query work only. It excludes cold startup, network, rendering, and browser interaction. The catalog is tiny; these figures do not establish a noticeable user-facing speedup. Hardware and runtime variation can change the result. The benchmark prints every round and checks exact result parity before timing. There is no synthetic larger data set.
