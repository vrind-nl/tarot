import os

root = "shadow"
for card in os.listdir(root):
    l = card.split("-")
    if "x" in l[-1]:
        new = "%s/%s.jpg" % (root, "-".join(l[:-1]))
        os.rename(os.path.join(root, card), new)
