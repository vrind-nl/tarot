rws = [l.strip() for l in open("rws.txt")]
tarot = [l.strip() for l in open("tarot.txt")]  # decks from tarot.com
hersteld = [l.strip() for l in open("hersteld.txt")]
shadow = [l.strip() for l in open("shadow.txt")]
marseille = [l.strip() for l in open("marseille.txt")]
sola = [l.strip() for l in open("sola.txt")]

print(
    """
<style>
@media print {
    table {page-break-inside: avoid;}
}
</style>
"""
)

for c in range(78):
    if (c % 5) == 0:
        if c > 0:
            print("</table>")
        print(
            """
<table>
<tr>
<th>Sola Busca (1491)</th>
<th>Marseille (1751)</th>
<th>Rider-Waite (1909)</th>
<th>Morgan-Greer (1979)</th>
<th>Connolly (1993)</th>
<th>Hersteld (1995)</th>
<th>Crystal Vision (2011)</th>
<th>Shadowscapes (2011)</th>
</tr>
"""
        )
    print(
        """<tr>
        <td><img width=180 src="sola/%s" title="sola/%s"></td>
        <td><img width=180 src="marseille/%s" title="marseille/%s"></td>
        <td><img width=220 src="rws/%s" title="rws/%s"></td>
        <td><img style="margin-bottom: 10" title="mg/%s" src="mg/%s"></td>
        <td><img width=220 src="connolly/%s" title="connolly/%s"></td>
        <td><img width=210 src="hersteld/%s" title="hersteld/%s"></td>
        <td><img width=210 src="crystal/%s" title="crystal/%s"></td>
        <td><img width=210 src="shadow/%s" title="shadow/%s"></td>
    </tr>
    """
        % (
            sola[c],
            sola[c],
            marseille[c],
            marseille[c],
            rws[c],
            rws[c],
            tarot[c],
            tarot[c],
            tarot[c],
            tarot[c],
            hersteld[c],
            hersteld[c],
            tarot[c],
            tarot[c],
            shadow[c],
            shadow[c],
        )
    )
print("</table>")
