def int2roman(input):
    if type(input) != type(1):
        raise TypeError("expected integer, got %s" % type(input))
    if input == 0:
        return "O"
    if not 0 < input < 4000:
        raise ValueError("Argument must be between 1 and 3999")
    ints = (1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1)
    nums = ("M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I")
    result = ""
    for i in range(len(ints)):
        count = int(input / ints[i])
        result += nums[i] * count
        input -= ints[i] * count
    return result


def roman2int(input):
    if type(input) != type(""):
        raise TypeError("expected string, got %s" % type(input))
    input = input.upper()
    if input == "O":
        return 0
    nums = ["M", "D", "C", "L", "X", "V", "I"]
    ints = [1000, 500, 100, 50, 10, 5, 1]
    places = []
    for c in input:
        if not c in nums:
            raise ValueError("input is not a valid roman numeral: %s" % input)
    for i in range(len(input)):
        c = input[i]
        value = ints[nums.index(c)]
        # If the next place holds a larger number, this value is negative.
        try:
            nextvalue = ints[nums.index(input[i + 1])]
            if nextvalue > value:
                value *= -1
        except IndexError:
            # there is no next place.
            pass
        places.append(value)
    sum = 0
    for n in places:
        sum += n
    # Easiest test for validity...
    if int2roman(sum) == input:
        return sum
    else:
        raise ValueError("input is not a valid roman numeral: %s" % input)
