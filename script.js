const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// get mouse position
let mouse = {
	x: null,
	y: null,
    radius: 80
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft/2;
		mouse.y = event.y + canvas.clientTop/2;
});

function draw(){
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2-png.width*2,
            this.y = y + canvas.height/2-png.height*2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2-png.width*2,
            this.baseY = y + canvas.height/2-png.height*2,
            this.density = ((Math.random() * 10) + 2);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;
            // check mouse position/particle position - collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            // distance past which the force is zero
            var maxDistance = 80;
            var force = (maxDistance - distance) / maxDistance;

            // if we go below zero, set it to zero.
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density) * 0.9;
            let directionY = (forceDirectionY * force * this.density) * 0.9;

            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX ) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.x -= dx/5;
                } if (this.y !== this.baseY) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.y -= dy/5;
                }
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for (var y = 0, y2 = data.height; y < y2; y++) {
            for (var x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb("+data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                    data.data[(y * 4 * data.width)+ (x * 4) +1] + "," +
                                    data.data[(y * 4 * data.width)+ (x * 4) +2]+")";

                    particleArray.push(new Particle(positionX*4, positionY*4, color));
                }
            }
        }

    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.2)'; // background
        ctx.fillRect(0, 0, innerWidth,innerHeight);
        
        for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();

    // RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
    window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		init();
	});
}

var png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAIABJREFUeF7tfQmYnGWV7vvva+1Lr+nOxpoQApEliUCQJezb2IooioJxhkXFUWcYkek7iqAijiAiuLA5grYoEhVBRqJcTAgQkkA2kpCl03tXVdf617/f53yV5DJelQjpdEdv8fRDp7uquup762zvec/5ORwkt2s+cmnPzGlT3h0zIrAc63tiIvdPH/vYve5B8vL3+WVy+3zPCb7jRz/Q9XJbNjM3mYpB0wV/ZKj4w3+79c4PTvDL2u9//qAAZNGiReIRHa2lzo5WrbW1CSLvIvB9VMvWtR/71y/dtd9PZQKf8KAA5Prrr9esob5KR0crL4o8pk3vQHEsD1mR7XK1OPWaz351cALPcL/+6YMCkJNOOOHI6U3pdTMPmYrphx4CcCGsehWaFMLz/N5VazYd943vPjy0X09mgp7soADk7IULT2xKxZbruo6m1iZ0TJ0C05RRKhcgwg2rVeuWq//tG5+boDPcr3/2oAFkSktmeTKZRHNbM2r1CpLJKMyIjMpYDqqu+KtffuXM/7zvid/u19OZgCc7KAA5//RFJx4+ddryWqUE1dTQ3tEGTROhKBw434HrODA0ub/s+Ed/7NNfG52Ac9xvf/KgAOTyyy/PTk1EBmUenM/54PgAiUQEihRA4oHAcyFJHIaHC/2FseL5h7Sm+0e39pc/89BT1f12UgfoiQ4KQOgsbvrENeXQtU1e8CArAmIxA4oMmIoA33PAczLA2SjlCz4fIpBlfmOl7K3eNWrfdOv9j20/QOf5tv/MwQII9x+fvLZcLuYMx6kgGldx6KGdCH0bYRhCEHnEIlGErovK2Bhs2wbHAdl0BqP5vD88Unq66rpf7XP95ffeu7T2tk9tHJ/goADk0gsvnBKTgx1N6SQ3VhpBPKGho7MJsihCkiQkU3FInIDc8DDqVgVmJALHqsMwDJSLZYicANv3XS8IBool92ef+PL91wMIx/Fc3/JTHxSAnHDEzBPPOWvRcqtSQHNTHJlsAqlUDAAHjuNgGDo7+NHhPqQSKWY1w4NDaMo2wQ04uhsEePBdH6Ike8VKpadQKD94zRfv//VbPrlxeuBBAcj7zz/9xHcuOHr5YN82TO1sRSQSQbVWhWvbiMcTSLc0I/QCVEoj4EMBrucBHI94pg2KLIPcXCU3gtzoCFpbWzAwMIAg5FEu1zdUa+4Vg7u2vfL1nuXWOJ3xX/W0BwUgH7hkccu8I1v6NBmcIMoYHS1i85Ze7OwfhKLIOP7EYzF37mFIx9KoW1UUSyVkmqeg/cjjoQcWNm9eh/LoToghj0jEwNDgCHhRhqprKOSGx/r7RjcMlovn3nr3Lwt/1emNw50PBkC4G/7xkgfiUeXypnQCLa1tGC2U8MNHHkW+KmJorIzO1ixmT0/hkq6LEIQ+xopFvGPhaci2z0R+YBt6N69FYXAHREmAwPPo3bIdZiKBaCYJr1pHrVRBLjf2iO8H39m0ffuGPrt5uKenx//j817yvvPTTVl92sb+YNWf+v3+wGfSA/LZq84+UZK5Zzjw6iHTp+Lwww+FrJv4yU8fx3Mvbca2vgJisShiUoDP3fRxyJKIWqWK+e88DdF0FkO9m7Bzy2sYK+QgSxyrWfp39qJ96nQomoKx0RH4joPQ9eF4jouAL9thWAHEqucDYRDCDn3EozHejEZSmm6aTzy17B9uv+fRX+0PAP74OSYVIESz5/p3fMyU9IeXr1uX7+rqErJCbr3r1A4NESKbimFKWytmHzsXtuviV08vxxPLXkYiZqI9HcOHPnQJJNWALOnomDoDyVQChZHtyOfyMEwTtUoR1WIB9XoFimbC9z149Tpq5RKsWhUIgMAPYfsBAgjQVAO1ugXVNBFJpuCDZ+5u1fOvfOreHy79+t88IHve4DuPO+ZWy6qOJOJGvC2r31gujIFHiEwyhmTMxJTOdpy44HhYToCNm17Hzv5hKJKMOXPnwExloEgmUpkUFElBtTIERRER0U309u7Es799Brt6dyGZyWBKexMyqThkhYdjVVEYzUMUFbhegGLFgheEECUVkUQKRiwGPxTw8ktr/HzNabrrrgdzfzeA0BtdMPfIuZm08WCmOXaUU/fRt/11tDVnkE2YSMcimDG9E+0zZyIMRfQPDsPItEOPN6E5k4LnuYhG45AFYoQHGOfFOwHuv+9BPPrk71D1JExva4ZTGcJJ8+dg3rw5iMcM5EaGUKs5kGQdI7kivBCImDHUfYAXJNi2h/XrNiy754HHTh0PMOg5J4XLuuCCC5rGBnZ93g1sNZ1tetT1Qk5VuFEJzk9FgW9LZbLo79sFObSRikaQSZmY3tmORFMrS23jzZ0o1jzAtWBE4pBEEbIkIRalWiXA8K41WLf6FTy1bA3WbO1FIVeFGdcx77Ap8CoFzD9hDg45tB01x0E+X4DjeHBcHpygYDg3ini6CTXLhV33nh7qG/7gvT/46cDfNCD0weju7qavgL5ftGiREIkg7tesXzY1ZY9va2vFqpdexpTWFhi6jGQ6jtlzZuHQWXNhJtuRL5QwunUreM+HFjWgRSKIGgZ8hDDiUeza/BJ2bliNgh1gxavb8etf/B7HLzwGJy+cjbgsYGp7E4YHd7GEwHZcFIo1VGsBjGgKuUIO23r7YdUd99DZJ+nd3d3eeIExIRZCgbpcHp0JBMcKsiInk2kuIhnQNDnkNSVUDWNzrViO50eGPpGMqSdLoqj19fVhrFBCLJ5Ax9R2HHPc8ThyztFQtRhUUcKzz/wWm57+DVRfwMzDjkSyuQmpzjZwCROtUztRK/Sjb8NzrGYp2R6luFAMDfFoFM3NaTh2Hdu3bka1kGdOY7Rk4cWXNyLT3Aw/4LF+0456CHzwl79Z3jOeYEwIIPv6hk6YPbspkTW3+56rRmNRLHjnKVBVFUPDIzjz7HORSGUgKApq1Sp2bN6M+275ImYkWzFt2gwk0inoZhSt82bh6AXzEYYuhra+gOoYBXgZ8DyUiyVWsVs1CxzPM9dG/yMqpmy7eOb3q7B5+zaoRsqt1sLHlr/06nsPBP814TGku7tbfGH58vmSJh+hq+rcRCIBTdNcSQSKxfzVtVpNJCrEdhyoqoaTF52KQw6bBV5SGO1OzK4CEWuWL8OrTz+LVDyKnf19yLa34eIlS7Dw1DPASRLc6gB6X3sJA9s2Y7R/J4qFEmzbQb48xljGZDwB27HR3NwEWVfw22dW47mVa6BEE2etXLPlyX39IL3d+00IIEu6umLDlnVMCO9iWdMG2tunPqTrwM03f72P3tA555zTmYzrpwgc9zUOSHOcAFmSMW3mDCi6jkQyAdOIIQAH33bg1OuMx3rh0Z8jnc3i+DNPx8x5x+CI2XMhSyr79LtBBbmhHdi64lmsX7sSlXIFZbsOy3ZRr1rMfQkS0NqUhmRqePnFTXhy2StPbRzIL367h/zXPH5iAFlyj1R4vUfvefrp4p4Xe8UVVxwSjRm32HVrFiBduuK5ZcuaMqn4nLlHwbFdjA7nMeOww2B7LsiKotEIKuUqOM9HvV5HdSyP11atxvQjD8Op556LlmlT0dTcilg0CUkS4fkOHMfG5lW/w0vP/AJ9gyNwbJs9N1nfrNmzIEtA6NYhaipeeHFDfeXa7TNe3tTb/9cc6Nu974QAQi+6u7ub3/TKK0fkK2PZZDL5Ds5zf8fJxkbO8y5SI8pq33Gv27Z1w1WiSL1zDYaZZH2OaDwGnuMgKwpCz0fguKhWihjtH8TI8AhmzZmNzpkzccS8Y9DS3oFYPMVye3J3IhfglbUrsPWVl1EeG0ZhaAiVchmJlgxmTJsKp1ZFMTcCnuex/rUdV9/b8+y3D0TceCOIEwEId/GFi68oFgqtRsz/+tKlL7EOXldX1/ERQ1tcrlpfIuLujDMWtoa+1+e5HmbOPAT9gzmoqgJTM9gZhX4Azg9RGs2hWi0z1+V7Hpo72jHziMMwY9YRSGZbkMo2oampCdFolAG3Y+smvLLqeWzfshGKzCOboircgK5KyA2OYtfO15GKJ8PNY/XY97//ePntfuL/2sdPBCB7sru/2LG7+OKzP+K57vcCP4BVr0NRdIiiAIkXmYWUyyU4dRtRzYARNWCoKoQQGB0aQSQRw2FzZ6G5vQN6NIZMSxOzElEESqUiarUq8oO9CNw6qqU8SsNDSDVnwUPEWI66jla4aaiW7ul5kvLgA3qbKED+7Js854wz5qoR7UxFkR4fK+RXu56rqIoKz3bguS5isRh4gYQNHgRBZvEkYUZBwDmOg9JYAXWninimCS0dU6AZOmKxCEzTRDabhSCKqFTKGB7qxVi+HzHVwM5tm5mFUFOrr78PthVg/aahh0aqlTs2bXr9xQOJyKQCZMmSJdKOHTsitm2XFi1aFqxYsehHoii+m4K2EHKsNUs9dE1TwfMCdN1EJBoBT/9xHIIggMTxGB7pR6VWQ7alBc2tLZAkGZqqIhKPo7WtFZ7vwnMsDA/2Y7D3NVSLReiKhngqjnWvbsbmrTuLvmB+0TDNNdu2bztm89adXzlQoEwqQP74TZ9++qJrdU2+k7IjeAEEZhk+BFGAqmmIRuIMGMM0mPXohgFJ4OE4Fqu+LbsOMxKFJMpgyYGmsmRA01XY9RpjkMkw+ne9jnqtyNrBniNi5ar1P4o1T/tgT0+Pc/jhMxbUi7VTslOm3Lty5cpxYXgnOqjv84ftxBOP/Wg8Fr1XkgUEjg/X9VgGRJZiGgZzP7KoQtYUCNRDj8chknKOKo+ACEIHCEOEAcfAJDCq1SqryOl+hqHRHRHRRfTu2AyeCzA4VF5mcamrBvu2PVyxqu979dUtW7u6uuTVq1/6sqaZN65du3ZcxXeT2kLeMWfO7HRr6hVBACSIlFuxDl4QhpBlkRV8Ai9DljUoisKyMBpX4AUeHBfCdV0GIGlOREGA53moVCrs99QjaWtrhlWro14dw7SOVvC8H657dUfTnff1jMydOzUuionTdUUxfv/cigfCMOTmz5/fuWLFinEV3U1qQBYuPG5WLBp9lfN9drB0kJTykgiOrIR4J/qSJIW5JYlAEuhnbGKBWYfv+8xdERh0I5BEUYJp6hBEDi2ZFLjAQ7k0hhkzpmHXYP43VhC899Zb72aCh7PPPu399YpVOeW0M5fuZqP32cLfyh0nNSCnnnrqLFXmXiVfT4dMoJBKkcCgL5Y/cxw7dKJWeIFjFkQA+EEj5oRBwL6nZGDP/el70nKlM0kiX5CMmvDcOhKxKFat2ZhXo83P3fa1Oy7Yc6ALFsybEdMTmSeefnrFWznkv+YxkxYQ8ttC6N3vOM77KECLAsdiBrkpjuf2xhICJgh8Bgp9kVWQ+yIGlwARhIa6kSUE9HtWj4hIpBIQBA6xhAk+DNGUSkIRgaW/XnaPpLd8LhrV/rVYrHU/9NBDLGacecrCM1zPk5557vlxETfsAW3SAnLpRRdN9Tj/tcD3pTAM4Ps0cMtBVWXmthrWIjIAiIuitJfckh94jLuiBIAKSTIkVdHYfUlaShYDnoCIsTRZ1ajfrqG1uQma6OM3//3sBffc/4ulF1988RFmVL/ooQf+69YDSZ9MWkC6Ljznd5wgnkyHTCmtrIgQBZHprmRZYq6KQKFDZZ98cl10X99lLVy6kVVQWkwxg76ntFgmJaNtIxTALIn+3daSRlM6htCx8MKq9Z/9yjce/Co9/tJL331azIzH7vnud3/617idt3PfSQnIZZedm/BsfjQMAp7AoBsBQm5IkcW9wZxcVyPrCtAI98xgWMygbwgsjuOhqBr7raTIrIahjEtihaWOTFsGTZkYZMlHNV/Ghte2XHPzVx781p5DPf+i869c+tjS+5ivPAC3SQnIey8+61JBVR52bbIOD7quwfMciCwWgMUEOmgK9I1A3fhqiK8pvXVZ0KfmFVmHLFFKrMJHAFESmVXQv6dPm4ZMcxYI6wjdMspDI9i8c9sF/37zQ0v3nH1XV1db1ap++Fe/+NUXDwAek0N18sdv9N1d5z4RBsFZodvIlOisKYOiYEzxgWIDfU8WwAI3T4hQ/xUIwkY2RgUfyUYdz4Oq6o05EllAPBGHYZjQTROmYbJ/W5VReNYYqrkRrNnw2mfuuGfpbW98TZde+p6P+n74ZE9Pz87xBmVSWsh73nN+MQjCKL154qa4IAQn8QwEOutG7PCp1dvIuDihwWUhhKyqrNYgMChGEO3uh2ABXdVUVs1T5pVKZxuuUBVYr31spBdWcRSrXtzy1DcfWPo/uoRdXV2ZgAuOffTHj457K3dSAvLe915Q5DieASKGHBQK4rstZHekYJ94cj8cKB0mK+LAkbXQz3Y3sCIRk3Feqm4iHosxKp7A1DWNscfk+mpWBVZ5GEJQx9hQL9atXj/YN1KY+/Djz79x7p279P2XXv3Ifz0y7lsjJh0gS84/Xy8ZwgjHcTrPU9HnQdd0yELDTXEiz6yC3NWemmKPG2GxhdEmPHRDQyKZRDqdQTyWalTrYcCApOezrRpcrw5JFFAujcK2xlAZHsToltdRsuu/7h12Ln946bIDPtE76QC56LzFx6um9jyrM4RGaktxQpNkFtRDLtxbGDZ4qkZ6S6kvY3tlifVMYvEkHNeFIitQFJX1TSRVYTwY9U2iOlEnIcZyI3DrRQz2b4ebH0V5dBSqyKEvV/vhV+978gMHsgZppCWT7HbRBWfdYJj6l2RKUdmnnWNpKsUIFkPoZ2+o1OlneyxFURWkmzJoa2uHophQZJW9w0q1xECiYpHiCtU29Vq1oVSs5ZEf3oXCSD/sfA5wbDa7WKtV3eGR0se/9gjrqx+w26QC5LLLLktUyyMbjYiRpSBMFtAI5GQpDSKRkYy7KXhGqctUuTeshAQQbVM7EI+noSlkLTITxrmezZYL0IwhjbgRNV8pFWDVyiiXhuFUCgisGgojQ5CpVx96IHbAst1wV9Gaf9dDzzx/oBCZVICcffa73qXK/FOpTFagg6Qqmw6a0lzKqhrgNKyG4gXFgz1ui1q0qUwasVQaqhphcYKysD2AMq6LQKE+iWOjMLoTleIwfK8O2HWMDg4g9DwGiO/aLJWuWzUUnfDuW7739NV/l4BcuPi001XT+HW6OSUQCJSeNmJI44tlVhTYGe0O8JQKE2CCDNqDQt1BmfS+qsrmRYhCkRQFgsTD8224dg2uXUVuaAD1ahEhHbwowKvXkBseRL1SAecHEMIAMsch9H0aRahtHRMPv++Rn/ceCFAmlYVccO67ulRF/VG2tZmjQ91jCWQlDe1tw13RjX4fchwTL8RTKURjNIYgwQ8adDyrXcjFcUS7CKCuY250EHatgkphFCLvg/cbDStyXyxulMsIPB8iF0LieVr9BC8IkK8G62O1yDHdPT3OeIMyqQA575zTVuq6ehzJQenAiUQk18TiB0+UiQyRrIUxtyYU1URzWys03WDWQ0Gbeu6N5lUA26qzmgOhA5EPUSrlmJWQZVTKYxjp72NWYOgaqKws5HLMssLAh8zS4TJLCsKQs3YNFk767mPPv/R3AwgpGV9ZvXxE1ZSkbjbcDrVpKQ4wekQS2M+o2pZlBfFYHLqZgKJrjCSkTxZxV2QdlNaGgQPHqqE0locq80y1GIYeioVROPUaSuUy+MBD4HhQFYWBTpqshqpFYYpIx3ZQt+vQdD1wfZz/+Tt+Pq69kEmV9i5ZsiQ92LtxJJ6MQ9aiLD2luEHEIgEhyQp03YAejcCMRhCPxhllIigS02SJvNDgsvwAruuwDnwh148SBW7HgmfTXoAQIuv/+nADsJ9RzKAeCaXVtWqRgeuHHuPCSBlZq9YYWPmS3XPb/b95z9+NhZz6zhOu1k3prkymBYJMwgWJ0SDERZEOKxqLIZlMUSRHjOKFtMed8fCDhmv3fI+5NKdWZ0syw3oJlcIQLLeCul2FzAuoW41ATukvzacTVe97NpMP0cStQj0X32/UK64Lt2az5y1ZdmXLWCQ+XvPpe4CeNDFk8btOupYX/TtTqSaIzIXQ1oUYG2eOxWPQDZ3VHPFkam+jidwTWY9NFuB54Kgj4rlsPE3hA+RHhxGLmgDnMUA8m0hHriFNlWW2sIYeF3gOatUyIydNVWdA0I1ALxaLzHocxw9f3VGY/shjy/4+VCdnL150Lc95d0bNOPSICV6UmJ6XAnm2KQtF01iwpoqb9TYCH5IkNAK9RNkX4FhWo57wa4BHLiqAqquwrBpC3wPRviRDVRWaqHXAByHqdQuB70KWBNh1Gz5TpYgsbjGr86glLLHtEP0DY/9x949+9+/j6bYmjYVcfPFZ1ztW5faoHmNr/HhZg6Zo0DQdtVoNmtko9GisgDqEVCi2t7cycMrlItssJ8CnVX9sEYBTr7Atc9TSrVp1NrpALeCQmlQix9wSuTaKJ9TQohtPsWQ3O7BHYmRZFhPYlYpjGBqu3H/nD3/7Ybpv96JF4nAmo9ZGRrz7ly2r7y+QJg0gF56/+Pui4H5YETQWqAVFY2p0+nTSJ5YKQKoGQ55Dc3Mz4okYy8KYwLowgmo5z4I0CRYC14JVqdEgKWyXsiQDEVUHaU4kRWApNOu1h2DLaijYM4Asq9EQ43mmjPToZ2wZGsfizcBA/id9fuZS13UjrRmpJyLyrZVyqeY63hP3/vg3N+0PUCYNIOefu/g+gXeuECFBNyOMhyKqnVwMpU88JzKXRQGepnGJWqHdi5osoFLMM/E0fJcFaVKS+HWqSRzEYhRDGvGAKnYm2Cb+i+qWeo2t0qDOYWF0hHbK71ZAqg1pkecxyyJA6rUaavUQZT/q9PYPlxMxOaXKPmSeb9RLivHjatH79O33PfK2KvpJA8gZZ5xynyz6V5hKFJppMv6KJzmP19Dzcmj4dMp+qMdBzSmEHlsoU68UEYsarMdhOS50TYYiilBJqSJxqFk1RsOH8FnAbrR/Q5TzOeaOqBgcHhwAbTghUtMk8TaBQf1g32eWQuRkPGoi0ZzC8FANTyxbyV5HNhFBOhlhHwTLxuZNu3Yc29OzrPJWrWXSAHL2me96WAjtS80ICaZl8AQI46kE9gllciry77IERVVZvSBJPDRJYOwsKQ8L+Rwt1EK9XsPUzg4IfAhVJe4LsGp0RiHjtxilL0qwKxXm8qjbSO7K8W1W4xi7E4g6xQ+BqPgaKzgzyRQiCR0hL2PnrhE8tewFzJlzGFJRHe2dh6JYrlkb1m185133/XTVwQ4Id9H5Zz4eWJXzZCPKZKEhNac4nn1PLqEhnBbYzym4NxpPEgKnDrtuMUmoxHMoVkqsGUUg6IqEcjEPzVCQjkdRd2w0NTfDqluo120EtouxQr7RQbTrLN5km7NMSU8xhb7oewKEevRNzRk2haWqBrxQwMatfRDIQqsVRGJJdEw9ovbKug0LvvDle9Yc9ICcf87pjwdW+TxBoa0OlGVJ7BAIFPp/Q2PFIeCBSDTK9FcK9c9DD/nREZZdCRwpS4j74kHrOKqlMVTLBQikDablShSsIxFQI6vm2PAsm7krspyxsQLTfmVbmqHKMqqVCvu7FENohIGyOVq2SZwY1SUQZBTKJYScCiOSxlDvZshGcjDv1Gd0d9/7ljefThaXxZ29eNHjnlc5Dx7HmFtR1SEy9Rst3PcgicpelpcqbaLmiVYhqiRwa4hENEgK1Q8iquUi6tUy4hGd9UCIdIzFIyw5CEIPJKK3604jMeB4xoHRmFssbrIBUXJj5KJIkE1g0L8pKdBlAaauwqMaSDUQhAIGdg0hO2MmRvKFXG9v4cO3ff17ezVdb8VKJg0gZ5624HFZdM9zLdocKrFGE8UNSkEpENM8YUOTRakwNa8ou2l0BGliKgjoPoCuKqjXKkxgx2qSShmKSkWmCGIIdU1lsYcCNmVc5I7oearVClPDkyUQpT842Njn2BDlURtZhCSE4BEwKiWVbYHlAEMDo+BpSkuPXf1P//T5u98KCG98zKQAZN68eVJM8Z9WNf5kyqc8j/IdDmYsxppP5LZs14Gs6pBIBirJlAiz2EKHw9hgkR5nw9QUZhWKKsMwNYS+C44PUa+VkYjFGXVCmx8C6oWUK2zDKYFL07lNzemG9tdxWPZFpCIBSwAhDJh60rWpUFShR6Ko2XUUCj7yNfH2m798xz+/XTAmDdvbdeSRcj4uP6Mb8gJyKSwDqttM1U7TUTSQQ8IGQdagagpbTMbxNO9BFTsNglIxR7kSVdseMqkkhkcH2Cc+25RiGx8UIWSKFWpERSMRVIoFVEplZik0o8hmTBSBgUEA1CyLDYqSdRDBaVlVRsFQ04pITk3XGM/lQxusloNZn+r++n4ZoZ4UFkKAjCWVZ2RVXEDuhEQILK+vVJm18CGpTSRImg49YkDXTNCCStJUMcqDBwvU5NIcyrh8Dz5cpNMJ0DWrqGnl2VVIigRdVSFyPHzXgVWtMXdIclKiT/zAZQCQ26Lag5ILimFUEzlOfXfji2YTTfZ36fGOK/T19hWOuvXuH+6XFbOTApDFJ81rcZzaVkVRNDpURVdYmkuDOkSX0+wmGzkQZCiqiEwmy2YLiYDco0AhV0NrYKl37lMFzoWIRQwk41FwAmBVxtiWOaJWPMdmsYmUJYQpbayrWQ6sWo0VhqLYGL+m35N7dOt2YxRudwzbk/ERYWnXnb7SgH3UDX9LgJx0/NxzxbD6C/p0MFGcobPawA08VKs04uzBqtfgECYCx5SIhhEFT/Pnmrp3vK2hTmk0p4ZHBhHVNaRTicbimVqJCSEow4oaRFB6zHVRASrKGhwK8j5V/hIjIE3dZP+n7IvxBGxASGCLbogtYDJUVlh62/vrtblf/nLP3kU6byeWTAoLOfnEoy+JasKj8Bobe3heZHyTamjwA7C1e6StsmyiMSg74hCLEp9F1brE4gfRItQXJ/dVLuRZT51SVOqHEGhEOFIHkqyGD32k00k21UvJAgESkBlRPyUENFVhsYVkrIDXWHLGdswT+0xxRWD9ehJQ1Oz681tWjJwSjVrmAAAM10lEQVRy5xNP2G8HiEnVoDpr0YJLDYN/WAh8WNUSEPINF0HqRVlha8HpcIqVGkrVeqlcLBdj8Thv6rFWwzA4nqcZBArwHtt3opD+lwugmypSqQSLG45VZp9+t26x1bAEHPXnfdoQwYsQJAVWvUGlaJROSzLsep2xvWQV1Ich5QoVj74XguTdlHWN5EuP33T7Ty7aX5LTCbcQEje8+vIfVkq8P49nKy+ICqFizmXC6ZDFCYnVJIVitegJOH3lylfZ/pF5xx71M0mULjI0FSIlXaEP0sPHoxHGYRFlQoIFAqRGMUQUWZ0iizxUWjwgUPsXcEM24gvfrTXcn+eD9qvkRnPwvYDNvzfm4CWIssgWEYSuBzd00TdYfvdXv/3oo/vDOiZF2nvJ2Ze0S0qt19AV8PDhu3U4BIzrwvNJfEAprgjLtoKB0cInXly18ZsnnDAzWhyxmnlB/qqiqhdETAOK2uhz6LLCArduKgyQaMyEzIOtFCea3YwYbLMpgeOHIsbKZZZisxGG3bJUmZKAWhWFwlhjCxGTrDa6iHuCPfk2QVBXfqL7nhP3l3VMCkAWnXBC+7RDp/RmMxkm1XEdC1Wrygo++iRSclW3HOTy+b5fP7NiyikL33F6pVL5gecHWhggwpIATWHuhFJmXZKhqzIiBnFMOhLxCELfQSmfY+mq7dShqRI03WSCCdcPYVFHEQE0nfY4Ek1DtL/LdshHDXP3jhWHWRRlgXXXQ+iLJUlW5t1w6/e27C/rmBSAdF144ZGz5xyyLpPOwrEttmSsWC4yC3FIG+X4GB3Jo1IuXeX4mG/Va1eymsEjjoviRsDciK5JMA2VkYERXWY8FIGhSEwbhJDcGQNPbcycGBE4XohytcYUj7SQxqcrvnmMr4GqyBjL52BSQuB7oM2obAWUS/rg0A0549Qv/OcDz+1PMCYFINf+45XXH3b4zNubMk2sjhga6sdAXz8sq8yq4nK5hlKpuql/cPAnlUpt78UjiT7fvcyB6ajoUx8zNKiyyKSg9GlPJ6NIJWJMmUgkIRV6VJUTpe94PgZGcghojlEiWZDEevXEBmh6hGm5imM5xl1pEiXSpCfm2VpaU9Ov6f7mT/ZO6u5PUCY8qH/2U9d9vaOj9ZPTZsxk/FMhP4Kdr2/D8PAgI/4IkHql1rZh644HJVE4jVa5UmpK2RBV70SY+PAh8AHbKKrKHGvrZlMJKJIAik3knggMsibKmEiva7kByjUbdDlw6nuwLqLAwYhE4fsc6JqJAnOhdagSD7fu0OsJRVm6dueYes946bMmHJAbPnXN0hmHHHpec0srZJlDuVpiyyxHB/oxOjqK4Vw+N5TPHbZp3Wuz47HEfTwvTCOXQ5NQlLoyTa8fhNQdnDmtk0uaOuJRuqQeKUtI09uY0KUUt6Gep0vuxbBrqAAv5CGLjfkSkQI604JRr6VBVBJvZpcrzFr6+gdDQZRu/taDS2/iaNXQON0mFJCurq6OzubItkOPOJJvaWnf68fHxsYw0LsD27buwNBo/oXBfO3kZcuW1Y866qhEYNszbaemy4pyu++5uzhBXOEF9kPw3FknHDf3sYSpqRFThSZLsEj8Rmyv0FirQcyux/noH6jBpguEKSoTzRElosoqixsUeyhRcF0K9D6G+gdRK1E6LFxzX88v7h5PMCY8hpx++sKOebOP3H7E7Nlce3sn23FFwrW+vp0o5cewYf1rIzv7B8/8zbI/rH6zD+TiU44/aUpH89NN2bjM+S402vhAlTiRjdz/VZs4YbBjw+uFB2zLSmnR+MdKxTFeEAQ+lUw0JEQhabtIlOdjaHgQ+Vwxxwe4vsXIPnrv0vG/BuKEWsiVV16ZbIoLo4fPOoqjXje5E2qd7ty+DfnRsXDdxte+86Of/vJjbwYG/f5D773wpnRK+V9UxIEuOOm5jI6nuMF2ZYUhEol02DdUuPGuB5d+ac9zXt7V1bFraMeOSETf2+xKJ5IMxL6+/mBgMHfd6nVbxiWA/6n3NaGAvO+Ss74085ApN0yZOhNTpnQydXupWMTwwBC2bH49t2u0/8iHHvrZ8L4A8omPvu/n6QR/AbG2ZB0kdKMb2w1P8x8caNvotrrSPvONi8gWLVhwRbY5fR+1gNvaKNNjFCdKpTJefvmVK/572YoH92fh92bvZcIAueKKK1SVK27r7Ohobu+chniCmj4GU3/s3NGLtWvXPX33dx48483eAP3+vRedfWY2rT/RnDF5soxKsdQgAnWaMZSZMEKWDbdS8U7/15vv+v2e56RLZzQ3p3/eOaX1XLrwZPuUFhjROOvFrF+/YceLL248uqdn/7C4+/I+JjSGfOg9Zy+MRvXfdnZOlds6pkEzSK0ooVyuYNPGLeGal16d9tNf/WrHm70RupDY7GnJJ9OJ6LsScQ22bUEibZZV3T0+LUDUNLjQNljBmjnd3cv2XpDluuuuy3RMSW9JRCNR0gUnM0loJgECrFr1yp2f+1z3x9/s7+/v30+YhVx7xbu7EsnoI81trXwq04JYIsne29at27B507bffuPu75y2L2/2o+/7h1majufjEdVQJOqzi6zKJwsJaQxOllGuuHi9r3TVPd9/5HtvfM5Pf/r6S+fMOuRhiQ8h02M1DZKqIwhFrFq59pQbu7v3WtO+vJb9cZ8JAYS5ipjwjeZs4ppkJotMcxt0w2S0xeZNW7Fx3fqPfPcHP6IdVW96u+ySxZc3paMP0nVaAsdGxGxs/qHampckVOsWeC2JQlG85I5vf/tnb3hC7pYvdA81NycyVFRShR9LphggdTvEypVr5nd3d4/7jsU/foMTAsgHus5dMmN6+z1UWSfTWRjRJARJQ7lUw9q1a50NWzYd3tOzdNubogHgo5eftyYVUeYQpe7R4mTa/sP2LzrQzSQgmbACeXjLtoHpe/Yn0vNed911SjpmVtPZmBDRFSY7jSaSMKNxOB6HJ5/83fzbb7/9bx+Q67u6tOTM5v8djenHJhJRpOJNkDQTNnFLgyPBqpfWXP3t7913z76A0XXxOWe1pLUndInknRJ8z2Xxg8YZaK2GpMdhezE3BB78lxs/f9Ubn/O8887rWDD/mB3xmAlF5BjNks5kmeIkCCX8/tkX59/4t24h1IwKqsN/6Jza+g5VUQRNMxCNpiDIOkqVEnb19edGdgwe3v21r+3TFp6rLj//u3FDvjJmkt9v7MiigKxFTAQBDyPa7vmhMm9s27bXu7/1rf+hSH//+98fzcSjxXQmjnQyhoihIZZIIJ5IoG77WL9m0/yP/8u//G1aSHdXlxw5vO1aURBm8Kp6dTRmIJHKIpNpZi1a6pkTXTI4MPLa5u197/jKV77yptft6OrqMjublLWa5E0jLS7xW42dKBIUw4RmxOAj/miuVL2su7v7Tw78X3nZh05ubk8ty2YSnKGryGSz7Mo9uXwxt+KldZ233XbbuK4Vn5DC8I7rrlPqMeHeZFz7oKzoEGSVyW7IV0cSycbshetidCSHoaHRX/cOjJ77ZhukaaevIbg/7uzIXKhJPhOwKVJj0YAg0WW5I+DkCKqlcOE/33jjH/6c+7to0aJ4+4xpf+D5oEXTldhxxx3HmZGo/fJLqx+54T9uuWJf3Ob+vs+4BnXKpt45e9o9ms5faRpRKKbBrq4Wj6URjSXZBYIbmxIC7NjRi1WrVn/upi/cvJfW+HNv9tPXXnW/oXOXx02Fp96H4wRsjp1kOj5TppOoLvnA0Gj1qje7EOTFZ56ZdYOqOr1z+idbm9suTGczS676xD//9/4+6H19vnEFpPv665PtHZn1miY2kdwzkUg3etJMt5uEFo2xLpxlOdj82tY/fOAjVy78Sy+cLrGXHxw8vLOjZY2pS7wsufCd2u71sDTTAaLiUXdgA/ypn7npluX7ehCT5X7jCsgNn/zkwsMPn/osxwWcSmNmUmNpJQVfzTCRyGSZNrd3Z3917dr1C2/6whf+4qDLv//bZ3uOOnrWYi7wI2CrMypsd4njWqyGIQ0wiem2vj78rRNOzn38Pe/5fy9SP1kO/s+9jnEDhDIq0ba2trW3TCXxAak6SH/L9lfRECbJaswIatU6Vq9e8/rv/vDCnKeeeurPBtFrlyw56ui5s9ZSqkw1g+fadKkDVMtjbHcirfGjplWl7i2/9tNfWDDZD/6AA0Lx4+hDZ9amTGmRaekL6apobzuTZAo8ZFUDJyoYGBz2+nsH3td9yy0/+UuHeOfXbrtDM9TrYqbKJD+0C55mBEmFyETStKHBspEbsz756c9/+Rv/H5A/cQL/9plrd7W2trbRsAtNsdI+EbqFdBEDXoDjB+gb6PvBV2//5uV/6QApq5p16LRSJGoo1A0kqoMA0SUFo0ODDGia5yBd1so1a99x93cfG/c1SuMF+P8B8/fxgi9LLnsAAAAASUVORK5CYII=";

// Run draw after page has been fully loaded
window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0); // metodo de canvas API
    draw();
});