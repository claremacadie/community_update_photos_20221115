def mystery_return
  a = [1, 2, 3]
  b = [2, 3, 4]
  c = [3, 4, 5]

  p a & b

  (a & b) | (c - a)
end

p mystery_return