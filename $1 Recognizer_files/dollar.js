/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *	  libraries, toolkits or training: A $1 recognizer for user interface
 *	  prototypes. Proceedings of the ACM Symposium on User Interface
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
	// console.log("new Point(" +Math.floor(x)+","+Math.floor(y)+")") ;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 10;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("0", new Array(new Point(173,107),new Point(173,106),new Point(172,106),new Point(168,106),new Point(164,107),new Point(160,107),new Point(157,109),new Point(155,110),new Point(152,111),new Point(150,111),new Point(148,112),new Point(147,113),new Point(146,114),new Point(145,114),new Point(144,115),new Point(142,116),new Point(141,118),new Point(138,123),new Point(136,127),new Point(134,131),new Point(133,133),new Point(132,135),new Point(132,137),new Point(132,141),new Point(130,148),new Point(129,157),new Point(129,165),new Point(129,171),new Point(129,177),new Point(129,182),new Point(129,187),new Point(131,193),new Point(132,201),new Point(133,205),new Point(136,211),new Point(137,216),new Point(141,231),new Point(145,243),new Point(151,259),new Point(154,270),new Point(156,276),new Point(158,279),new Point(161,281),new Point(164,284),new Point(167,288),new Point(170,291),new Point(172,295),new Point(178,297),new Point(183,299),new Point(188,301),new Point(193,303),new Point(198,305),new Point(202,308),new Point(206,310),new Point(209,312),new Point(212,313),new Point(217,314),new Point(220,314),new Point(225,314),new Point(228,315),new Point(234,315),new Point(239,313),new Point(243,311),new Point(245,309),new Point(248,307),new Point(251,305),new Point(253,303),new Point(255,299),new Point(263,288),new Point(265,277),new Point(269,269),new Point(272,259),new Point(274,250),new Point(276,242),new Point(276,237),new Point(277,233),new Point(278,226),new Point(278,217),new Point(278,211),new Point(278,203),new Point(277,192),new Point(277,187),new Point(277,185),new Point(277,183),new Point(277,182),new Point(277,169),new Point(277,160),new Point(277,156),new Point(277,150),new Point(277,147),new Point(276,146),new Point(275,145),new Point(269,141),new Point(264,136),new Point(257,131),new Point(252,124),new Point(245,119),new Point(241,114),new Point(239,113),new Point(238,111),new Point(237,111),new Point(236,111),new Point(235,111),new Point(235,110),new Point(234,110),new Point(233,110),new Point(232,109),new Point(227,107),new Point(223,106),new Point(220,106),new Point(218,106),new Point(216,105),new Point(214,105),new Point(213,105),new Point(212,105),new Point(210,105),new Point(209,105),new Point(206,105),new Point(205,105),new Point(204,105),new Point(203,105),new Point(202,105),new Point(202,106))) ;

	this.Unistrokes[1] = new Unistroke("1",new Array(new Point(191,58),new Point(191,59),new Point(191,64),new Point(191,67),new Point(191,69),new Point(191,72),new Point(191,74),new Point(191,78),new Point(191,82),new Point(191,86),new Point(191,90),new Point(191,95),new Point(191,98),new Point(191,101),new Point(191,105),new Point(191,111),new Point(191,116),new Point(191,122),new Point(191,130),new Point(191,139),new Point(191,147),new Point(191,156),new Point(192,169),new Point(193,179),new Point(194,192),new Point(195,200),new Point(195,207),new Point(196,220),new Point(196,228),new Point(197,237),new Point(197,246),new Point(197,250),new Point(198,254),new Point(199,257),new Point(199,260),new Point(199,261),new Point(200,263),new Point(200,265),new Point(200,266),new Point(200,267),new Point(201,267),new Point(201,268),new Point(202,269),new Point(202,270),new Point(202,271),new Point(202,272),new Point(202,273),new Point(203,273),new Point(203,274),new Point(203,275),new Point(203,278),new Point(203,281),new Point(203,286),new Point(203,291),new Point(203,294),new Point(203,297),new Point(202,299)));

	this.Unistrokes[2] = new Unistroke("2",new Array(new Point(106,125),new Point(106,124),new Point(106,123),new Point(106,122),new Point(107,121),new Point(107,120),new Point(108,119),new Point(109,117),new Point(110,114),new Point(111,112),new Point(113,110),new Point(115,108),new Point(116,107),new Point(117,107),new Point(117,106),new Point(120,105),new Point(121,104),new Point(122,103),new Point(123,101),new Point(125,100),new Point(127,100),new Point(130,99),new Point(131,98),new Point(133,98),new Point(135,95),new Point(137,94),new Point(139,94),new Point(142,92),new Point(144,91),new Point(146,91),new Point(149,90),new Point(151,89),new Point(154,89),new Point(156,88),new Point(159,88),new Point(161,88),new Point(163,88),new Point(166,88),new Point(168,88),new Point(170,88),new Point(173,88),new Point(175,88),new Point(178,88),new Point(180,90),new Point(185,90),new Point(188,92),new Point(192,93),new Point(194,95),new Point(196,97),new Point(198,98),new Point(200,99),new Point(202,101),new Point(203,103),new Point(205,106),new Point(206,107),new Point(209,109),new Point(210,111),new Point(213,115),new Point(214,118),new Point(215,126),new Point(216,132),new Point(217,136),new Point(218,139),new Point(219,142),new Point(219,144),new Point(220,146),new Point(221,149),new Point(221,151),new Point(222,154),new Point(223,157),new Point(223,159),new Point(223,161),new Point(223,164),new Point(224,166),new Point(224,169),new Point(224,170),new Point(224,171),new Point(224,173),new Point(224,175),new Point(224,178),new Point(224,180),new Point(224,183),new Point(222,185),new Point(222,187),new Point(221,188),new Point(220,190),new Point(219,192),new Point(215,198),new Point(212,202),new Point(211,205),new Point(209,209),new Point(207,212),new Point(205,214),new Point(203,216),new Point(202,217),new Point(201,218),new Point(200,221),new Point(197,223),new Point(195,225),new Point(191,229),new Point(188,231),new Point(184,234),new Point(183,236),new Point(181,238),new Point(179,239),new Point(177,241),new Point(174,243),new Point(172,244),new Point(171,245),new Point(169,247),new Point(167,248),new Point(165,249),new Point(162,250),new Point(160,251),new Point(158,253),new Point(156,256),new Point(152,257),new Point(150,258),new Point(148,259),new Point(147,260),new Point(145,262),new Point(143,263),new Point(140,264),new Point(136,266),new Point(134,267),new Point(131,268),new Point(130,270),new Point(123,275),new Point(120,278),new Point(117,281),new Point(114,285),new Point(112,285),new Point(111,287),new Point(110,287),new Point(109,287),new Point(108,287),new Point(108,288),new Point(107,288),new Point(106,288),new Point(105,288),new Point(104,288),new Point(104,289),new Point(103,289),new Point(103,289),new Point(104,289),new Point(105,290),new Point(109,290),new Point(111,290),new Point(115,290),new Point(120,290),new Point(127,291),new Point(132,291),new Point(139,288),new Point(143,288),new Point(147,288),new Point(150,288),new Point(154,288),new Point(156,288),new Point(158,288),new Point(160,288),new Point(163,288),new Point(166,288),new Point(168,288),new Point(170,288),new Point(172,288),new Point(174,288),new Point(176,288),new Point(179,288),new Point(181,288),new Point(183,288),new Point(185,288),new Point(190,288),new Point(193,288),new Point(196,288),new Point(199,288),new Point(202,288),new Point(204,288),new Point(206,288),new Point(209,287),new Point(211,287),new Point(213,287),new Point(215,287),new Point(216,287),new Point(217,287),new Point(218,287),new Point(219,287),new Point(220,287),new Point(221,287),new Point(222,287),new Point(223,287),new Point(224,287),new Point(225,287),new Point(226,287),new Point(228,287),new Point(230,287),new Point(232,287),new Point(233,287),new Point(234,287),new Point(235,287)));

	this.Unistrokes[3] = new Unistroke("3",new Array(new Point(140,84),new Point(144,84),new Point(152,84),new Point(163,84),new Point(172,84),new Point(180,82),new Point(188,80),new Point(196,80),new Point(201,79),new Point(205,79),new Point(208,79),new Point(212,79),new Point(215,79),new Point(220,79),new Point(223,81),new Point(225,84),new Point(231,88),new Point(235,90),new Point(239,93),new Point(242,95),new Point(245,97),new Point(248,101),new Point(251,103),new Point(253,105),new Point(255,109),new Point(256,113),new Point(258,116),new Point(259,118),new Point(261,122),new Point(262,124),new Point(263,128),new Point(263,130),new Point(263,132),new Point(263,137),new Point(263,139),new Point(263,141),new Point(263,143),new Point(263,147),new Point(263,149),new Point(263,153),new Point(262,155),new Point(261,157),new Point(259,160),new Point(257,163),new Point(255,166),new Point(253,169),new Point(251,172),new Point(248,175),new Point(247,176),new Point(245,178),new Point(243,181),new Point(240,183),new Point(236,185),new Point(231,187),new Point(227,190),new Point(225,191),new Point(222,192),new Point(219,194),new Point(217,196),new Point(213,197),new Point(209,199),new Point(204,201),new Point(197,204),new Point(192,207),new Point(187,209),new Point(183,210),new Point(179,212),new Point(175,214),new Point(173,214),new Point(170,215),new Point(167,216),new Point(162,216),new Point(159,218),new Point(155,219),new Point(152,221),new Point(150,221),new Point(148,221),new Point(146,221),new Point(145,221),new Point(145,222),new Point(144,222),new Point(144,222),new Point(145,222),new Point(146,222),new Point(149,222),new Point(153,222),new Point(155,222),new Point(158,222),new Point(161,221),new Point(165,221),new Point(169,220),new Point(173,220),new Point(178,220),new Point(182,220),new Point(186,220),new Point(190,220),new Point(195,220),new Point(199,220),new Point(202,220),new Point(206,220),new Point(210,220),new Point(212,220),new Point(214,220),new Point(218,222),new Point(222,224),new Point(225,226),new Point(229,227),new Point(232,229),new Point(236,231),new Point(240,234),new Point(243,237),new Point(245,239),new Point(248,241),new Point(251,244),new Point(253,246),new Point(255,248),new Point(257,250),new Point(259,251),new Point(260,253),new Point(261,255),new Point(262,257),new Point(263,259),new Point(264,260),new Point(266,262),new Point(266,264),new Point(267,265),new Point(268,267),new Point(269,270),new Point(270,272),new Point(270,274),new Point(271,276),new Point(272,277),new Point(272,278),new Point(272,279),new Point(272,280),new Point(272,283),new Point(272,286),new Point(272,287),new Point(272,289),new Point(272,290),new Point(272,292),new Point(272,293),new Point(272,294),new Point(272,295),new Point(272,297),new Point(272,299),new Point(272,301),new Point(271,303),new Point(271,304),new Point(269,305),new Point(267,307),new Point(266,309),new Point(265,310),new Point(263,311),new Point(261,313),new Point(259,315),new Point(257,316),new Point(254,318),new Point(250,320),new Point(247,321),new Point(244,323),new Point(243,324),new Point(242,324),new Point(240,325),new Point(239,326),new Point(238,326),new Point(234,327),new Point(231,328),new Point(229,329),new Point(226,331),new Point(224,332),new Point(222,332),new Point(219,333),new Point(218,334),new Point(215,334),new Point(213,335),new Point(211,335),new Point(208,335),new Point(206,335),new Point(204,335),new Point(201,335),new Point(199,335),new Point(195,335),new Point(192,335),new Point(189,335),new Point(187,335),new Point(184,335),new Point(182,335),new Point(181,335),new Point(178,335),new Point(175,335),new Point(172,335),new Point(169,335),new Point(166,335),new Point(163,335),new Point(160,335),new Point(159,335),new Point(158,335),new Point(157,335),new Point(156,335),new Point(155,335),new Point(154,335),new Point(152,335),new Point(151,335),new Point(150,335),new Point(149,335),new Point(148,335),new Point(147,335),new Point(146,335),new Point(144,335),new Point(143,335),new Point(141,335),new Point(140,335),new Point(139,335),new Point(138,335),new Point(137,335),new Point(136,335),new Point(136,334),new Point(135,334),new Point(134,334),new Point(133,333),new Point(132,333)));

	this.Unistrokes[4] = new Unistroke("4",new Array(new Point(201,61),new Point(199,64),new Point(196,71),new Point(193,77),new Point(190,85),new Point(188,90),new Point(185,95),new Point(182,100),new Point(179,105),new Point(177,110),new Point(173,115),new Point(170,119),new Point(168,122),new Point(166,125),new Point(165,129),new Point(164,132),new Point(163,134),new Point(162,137),new Point(160,140),new Point(160,142),new Point(159,144),new Point(157,148),new Point(156,150),new Point(156,152),new Point(156,153),new Point(156,154),new Point(156,155),new Point(155,156),new Point(154,158),new Point(153,161),new Point(153,163),new Point(152,164),new Point(152,165),new Point(152,166),new Point(152,167),new Point(152,168),new Point(151,169),new Point(151,170),new Point(151,171),new Point(151,172),new Point(151,174),new Point(151,175),new Point(150,176),new Point(150,179),new Point(150,181),new Point(148,182),new Point(148,184),new Point(148,185),new Point(148,186),new Point(148,187),new Point(148,188),new Point(150,189),new Point(151,190),new Point(152,191),new Point(154,192),new Point(155,193),new Point(157,193),new Point(160,194),new Point(163,195),new Point(166,195),new Point(171,195),new Point(175,195),new Point(179,196),new Point(182,196),new Point(185,197),new Point(187,197),new Point(189,197),new Point(191,197),new Point(194,198),new Point(197,199),new Point(199,199),new Point(202,199),new Point(205,199),new Point(207,199),new Point(210,199),new Point(212,199),new Point(215,199),new Point(217,199),new Point(219,199),new Point(221,199),new Point(222,199),new Point(226,200),new Point(231,200),new Point(234,200),new Point(236,200),new Point(238,200),new Point(239,200)));

	this.Unistrokes[5] = new Unistroke("5",new Array(new Point(261,88),new Point(259,88),new Point(257,88),new Point(255,88),new Point(253,88),new Point(250,88),new Point(244,88),new Point(236,88),new Point(229,88),new Point(222,88),new Point(216,86),new Point(210,86),new Point(205,86),new Point(202,86),new Point(199,86),new Point(197,86),new Point(196,86),new Point(195,86),new Point(192,86),new Point(190,86),new Point(188,86),new Point(184,86),new Point(181,86),new Point(177,86),new Point(174,86),new Point(170,86),new Point(168,86),new Point(166,86),new Point(165,86),new Point(164,86),new Point(163,86),new Point(162,86),new Point(161,89),new Point(160,90),new Point(159,92),new Point(157,93),new Point(156,94),new Point(156,95),new Point(155,96),new Point(155,97),new Point(155,98),new Point(155,99),new Point(154,101),new Point(153,104),new Point(153,106),new Point(153,108),new Point(152,110),new Point(152,112),new Point(152,114),new Point(151,116),new Point(151,118),new Point(151,121),new Point(151,125),new Point(151,127),new Point(151,130),new Point(151,133),new Point(151,136),new Point(151,138),new Point(151,141),new Point(151,144),new Point(151,147),new Point(151,150),new Point(151,152),new Point(151,154),new Point(151,155),new Point(151,157),new Point(151,159),new Point(151,160),new Point(151,162),new Point(151,164),new Point(151,166),new Point(151,167),new Point(151,170),new Point(151,172),new Point(151,173),new Point(151,175),new Point(151,176),new Point(151,178),new Point(151,180),new Point(151,182),new Point(151,184),new Point(151,187),new Point(151,188),new Point(151,190),new Point(151,191),new Point(151,192),new Point(152,193),new Point(152,194),new Point(152,195),new Point(153,196),new Point(154,196),new Point(155,197),new Point(156,197),new Point(157,197),new Point(159,197),new Point(161,197),new Point(164,197),new Point(166,197),new Point(169,197),new Point(172,197),new Point(175,197),new Point(178,197),new Point(182,196),new Point(186,196),new Point(189,195),new Point(192,194),new Point(197,193),new Point(200,192),new Point(203,191),new Point(206,190),new Point(209,190),new Point(213,189),new Point(217,189),new Point(219,188),new Point(222,188),new Point(226,188),new Point(229,188),new Point(232,188),new Point(234,188),new Point(238,188),new Point(240,189),new Point(244,190),new Point(248,191),new Point(250,192),new Point(252,193),new Point(256,196),new Point(259,199),new Point(261,201),new Point(263,203),new Point(265,204),new Point(267,206),new Point(268,208),new Point(270,210),new Point(271,212),new Point(272,214),new Point(275,216),new Point(276,218),new Point(276,220),new Point(277,223),new Point(277,224),new Point(277,226),new Point(277,228),new Point(277,230),new Point(277,233),new Point(277,235),new Point(277,237),new Point(277,240),new Point(277,242),new Point(277,245),new Point(277,247),new Point(277,251),new Point(277,253),new Point(277,255),new Point(277,259),new Point(277,261),new Point(276,262),new Point(276,264),new Point(275,267),new Point(275,269),new Point(273,272),new Point(273,274),new Point(271,276),new Point(270,279),new Point(269,281),new Point(267,284),new Point(266,286),new Point(263,289),new Point(262,291),new Point(260,294),new Point(259,296),new Point(257,298),new Point(254,300),new Point(251,302),new Point(248,304),new Point(244,305),new Point(242,307),new Point(239,307),new Point(236,309),new Point(232,311),new Point(229,313),new Point(227,313),new Point(224,314),new Point(219,314),new Point(215,315),new Point(210,316),new Point(207,317),new Point(203,317),new Point(200,318),new Point(197,318),new Point(195,318),new Point(191,318),new Point(188,320),new Point(185,320),new Point(183,320),new Point(180,320),new Point(178,320),new Point(175,320),new Point(171,320),new Point(168,320),new Point(165,318),new Point(163,317),new Point(162,317),new Point(161,317),new Point(160,317),new Point(160,316),new Point(159,316),new Point(158,316),new Point(158,314),new Point(157,314),new Point(157,313),new Point(156,312),new Point(156,311),new Point(155,309),new Point(155,308),new Point(155,307),new Point(154,306),new Point(154,305),new Point(153,304),new Point(152,304),new Point(152,303),new Point(152,302),new Point(151,302),new Point(151,301),new Point(150,300),new Point(150,299),new Point(149,298),new Point(148,297),new Point(147,296),new Point(147,295),new Point(146,295)));


	this.Unistrokes[6] = new Unistroke("6",new Array(new Point(263,99),new Point(262,99),new Point(260,99),new Point(258,98),new Point(255,97),new Point(253,97),new Point(249,96),new Point(247,96),new Point(245,96),new Point(243,96),new Point(239,96),new Point(236,96),new Point(233,96),new Point(231,96),new Point(228,96),new Point(226,96),new Point(223,96),new Point(221,96),new Point(218,96),new Point(214,96),new Point(211,96),new Point(208,96),new Point(204,96),new Point(201,97),new Point(199,99),new Point(196,99),new Point(194,101),new Point(191,103),new Point(188,105),new Point(185,107),new Point(181,111),new Point(178,113),new Point(176,116),new Point(173,119),new Point(169,124),new Point(167,126),new Point(164,131),new Point(160,135),new Point(159,139),new Point(158,142),new Point(156,144),new Point(156,146),new Point(155,150),new Point(155,152),new Point(153,155),new Point(152,158),new Point(152,161),new Point(152,165),new Point(151,169),new Point(150,174),new Point(150,181),new Point(150,187),new Point(150,194),new Point(150,201),new Point(150,206),new Point(150,211),new Point(150,216),new Point(151,222),new Point(153,227),new Point(154,231),new Point(156,235),new Point(157,239),new Point(158,245),new Point(160,248),new Point(161,251),new Point(163,255),new Point(165,257),new Point(166,261),new Point(168,265),new Point(170,268),new Point(172,270),new Point(173,273),new Point(175,276),new Point(177,278),new Point(179,282),new Point(182,284),new Point(184,286),new Point(186,288),new Point(189,290),new Point(192,292),new Point(194,294),new Point(197,296),new Point(200,297),new Point(203,300),new Point(205,301),new Point(208,302),new Point(210,303),new Point(212,305),new Point(215,305),new Point(217,306),new Point(220,307),new Point(223,307),new Point(227,308),new Point(230,308),new Point(234,309),new Point(238,309),new Point(242,309),new Point(245,309),new Point(247,309),new Point(252,309),new Point(255,309),new Point(257,309),new Point(260,309),new Point(262,309),new Point(264,307),new Point(267,305),new Point(269,303),new Point(271,302),new Point(273,300),new Point(275,298),new Point(276,296),new Point(279,293),new Point(282,291),new Point(283,289),new Point(286,286),new Point(287,284),new Point(289,283),new Point(291,281),new Point(292,280),new Point(294,278),new Point(294,277),new Point(296,276),new Point(296,274),new Point(296,272),new Point(298,270),new Point(298,267),new Point(299,265),new Point(300,263),new Point(300,260),new Point(301,256),new Point(301,253),new Point(301,251),new Point(301,249),new Point(301,246),new Point(301,244),new Point(301,242),new Point(301,240),new Point(301,239),new Point(300,236),new Point(299,233),new Point(297,231),new Point(295,229),new Point(293,228),new Point(291,227),new Point(290,226),new Point(288,224),new Point(287,223),new Point(285,223),new Point(284,222),new Point(281,221),new Point(279,220),new Point(276,218),new Point(272,217),new Point(269,215),new Point(265,214),new Point(261,214),new Point(258,212),new Point(254,212),new Point(251,211),new Point(247,211),new Point(244,211),new Point(240,210),new Point(236,210),new Point(233,210),new Point(229,210),new Point(227,210),new Point(223,210),new Point(220,210),new Point(218,210),new Point(213,210),new Point(210,210),new Point(206,210),new Point(204,210),new Point(200,210),new Point(197,210),new Point(193,212),new Point(189,213),new Point(186,214),new Point(184,215),new Point(182,216),new Point(180,217),new Point(179,217),new Point(177,219),new Point(174,221),new Point(172,223),new Point(170,225),new Point(169,226),new Point(168,228),new Point(166,230),new Point(165,232),new Point(164,235),new Point(163,237),new Point(162,238),new Point(161,239),new Point(161,240),new Point(161,241),new Point(160,241),new Point(160,242),new Point(160,243),new Point(160,245)));
	this.Unistrokes[7] = new Unistroke("7",new Array(new Point(131,83),new Point(132,83),new Point(135,83),new Point(138,83),new Point(141,83),new Point(145,83),new Point(147,83),new Point(153,83),new Point(157,83),new Point(160,83),new Point(164,83),new Point(166,83),new Point(170,83),new Point(174,83),new Point(178,83),new Point(181,83),new Point(183,83),new Point(186,83),new Point(189,83),new Point(193,83),new Point(199,83),new Point(203,83),new Point(207,83),new Point(212,83),new Point(216,83),new Point(220,83),new Point(225,83),new Point(227,83),new Point(230,83),new Point(233,83),new Point(235,83),new Point(237,83),new Point(239,83),new Point(241,83),new Point(243,83),new Point(245,82),new Point(247,82),new Point(249,82),new Point(250,82),new Point(251,82),new Point(251,81),new Point(252,81),new Point(253,81),new Point(253,82),new Point(253,83),new Point(253,85),new Point(254,87),new Point(254,89),new Point(254,91),new Point(254,92),new Point(254,94),new Point(254,97),new Point(254,101),new Point(254,104),new Point(254,107),new Point(254,111),new Point(254,115),new Point(254,120),new Point(254,125),new Point(254,130),new Point(254,138),new Point(254,142),new Point(254,146),new Point(254,150),new Point(254,155),new Point(254,159),new Point(254,164),new Point(254,169),new Point(254,176),new Point(254,181),new Point(254,186),new Point(254,191),new Point(254,196),new Point(254,202),new Point(254,207),new Point(255,210),new Point(255,214),new Point(255,218),new Point(255,222),new Point(255,225),new Point(255,228),new Point(255,230),new Point(256,233),new Point(256,235),new Point(256,238),new Point(256,241),new Point(256,244),new Point(256,246),new Point(256,248),new Point(256,251),new Point(257,252),new Point(257,254),new Point(257,255),new Point(257,257),new Point(257,258),new Point(257,259),new Point(257,261),new Point(258,263),new Point(258,264),new Point(258,266),new Point(258,267),new Point(258,269),new Point(259,270),new Point(259,271),new Point(259,273),new Point(259,274),new Point(259,275),new Point(259,276),new Point(259,278),new Point(260,279),new Point(260,281),new Point(260,282),new Point(260,283),new Point(260,284),new Point(260,285),new Point(260,286),new Point(260,287),new Point(260,288),new Point(260,289),new Point(260,290),new Point(260,291),new Point(260,293),new Point(260,297)));
	this.Unistrokes[8] = new Unistroke("8",new Array(new Point(256,105),new Point(256,104),new Point(256,102),new Point(255,101),new Point(252,99),new Point(251,98),new Point(248,96),new Point(246,95),new Point(243,94),new Point(241,93),new Point(238,92),new Point(235,91),new Point(232,90),new Point(230,90),new Point(227,89),new Point(225,89),new Point(222,89),new Point(220,89),new Point(218,89),new Point(215,88),new Point(212,88),new Point(208,88),new Point(204,88),new Point(200,88),new Point(196,88),new Point(193,88),new Point(190,88),new Point(187,88),new Point(184,88),new Point(182,88),new Point(179,88),new Point(176,88),new Point(172,88),new Point(170,90),new Point(168,90),new Point(167,91),new Point(165,92),new Point(163,93),new Point(160,95),new Point(157,96),new Point(155,97),new Point(154,98),new Point(153,99),new Point(152,100),new Point(150,102),new Point(149,104),new Point(147,107),new Point(146,109),new Point(146,112),new Point(146,115),new Point(145,120),new Point(145,124),new Point(145,127),new Point(145,131),new Point(145,134),new Point(145,138),new Point(145,142),new Point(145,146),new Point(147,150),new Point(148,154),new Point(151,158),new Point(153,162),new Point(156,167),new Point(158,169),new Point(160,172),new Point(163,175),new Point(165,177),new Point(169,180),new Point(171,183),new Point(173,185),new Point(178,188),new Point(183,192),new Point(187,196),new Point(194,201),new Point(198,204),new Point(204,207),new Point(207,209),new Point(211,212),new Point(216,215),new Point(219,217),new Point(222,220),new Point(227,224),new Point(232,229),new Point(238,235),new Point(241,239),new Point(244,242),new Point(249,245),new Point(252,248),new Point(255,251),new Point(258,255),new Point(261,257),new Point(263,261),new Point(267,264),new Point(269,266),new Point(270,268),new Point(270,271),new Point(271,272),new Point(271,274),new Point(271,275),new Point(271,276),new Point(271,277),new Point(271,278),new Point(271,280),new Point(271,283),new Point(271,285),new Point(271,287),new Point(269,291),new Point(267,293),new Point(266,294),new Point(264,299),new Point(263,301),new Point(262,302),new Point(261,303),new Point(259,305),new Point(257,306),new Point(253,307),new Point(251,308),new Point(248,310),new Point(244,311),new Point(240,312),new Point(235,315),new Point(231,317),new Point(225,318),new Point(222,319),new Point(218,320),new Point(213,321),new Point(209,321),new Point(206,322),new Point(204,322),new Point(202,322),new Point(200,322),new Point(198,322),new Point(195,322),new Point(191,322),new Point(187,322),new Point(184,322),new Point(181,322),new Point(177,322),new Point(174,322),new Point(171,322),new Point(169,322),new Point(166,321),new Point(164,319),new Point(163,318),new Point(161,316),new Point(160,314),new Point(159,311),new Point(158,309),new Point(158,307),new Point(157,303),new Point(157,300),new Point(157,296),new Point(157,293),new Point(157,288),new Point(157,283),new Point(157,278),new Point(157,271),new Point(158,265),new Point(160,257),new Point(161,255),new Point(163,251),new Point(164,248),new Point(165,244),new Point(167,241),new Point(168,238),new Point(170,235),new Point(171,232),new Point(172,230),new Point(174,226),new Point(175,222),new Point(177,220),new Point(179,218),new Point(181,214),new Point(182,211),new Point(184,208),new Point(185,205),new Point(187,203),new Point(189,199),new Point(191,195),new Point(193,192),new Point(197,189),new Point(199,186),new Point(201,184),new Point(203,181),new Point(206,177),new Point(209,174),new Point(212,170),new Point(214,167),new Point(216,164),new Point(220,162),new Point(222,159),new Point(224,157),new Point(226,155),new Point(229,152),new Point(231,149),new Point(233,147),new Point(235,145),new Point(237,143),new Point(240,141),new Point(242,139),new Point(244,138),new Point(246,136),new Point(248,135),new Point(249,134),new Point(251,133),new Point(253,132),new Point(257,131),new Point(259,130),new Point(261,129),new Point(263,128),new Point(265,126),new Point(266,126),new Point(268,125),new Point(270,125),new Point(271,124),new Point(272,123),new Point(273,123),new Point(275,123),new Point(275,122),new Point(276,122)));
	this.Unistrokes[9] = new Unistroke("9",new Array(new Point(281,88),new Point(281,87),new Point(281,84),new Point(281,82),new Point(280,81),new Point(280,79),new Point(277,77),new Point(275,75),new Point(273,74),new Point(271,73),new Point(269,71),new Point(267,70),new Point(264,68),new Point(262,66),new Point(259,65),new Point(256,63),new Point(254,61),new Point(253,61),new Point(250,60),new Point(247,59),new Point(244,58),new Point(242,58),new Point(240,57),new Point(237,57),new Point(235,57),new Point(232,57),new Point(229,57),new Point(226,57),new Point(224,57),new Point(222,57),new Point(220,57),new Point(219,57),new Point(217,57),new Point(215,57),new Point(210,58),new Point(204,61),new Point(199,63),new Point(195,66),new Point(193,68),new Point(189,70),new Point(186,73),new Point(183,75),new Point(181,77),new Point(180,78),new Point(179,79),new Point(177,80),new Point(175,82),new Point(173,85),new Point(171,87),new Point(168,90),new Point(167,92),new Point(165,95),new Point(163,96),new Point(162,100),new Point(161,102),new Point(159,106),new Point(158,109),new Point(157,112),new Point(156,115),new Point(155,119),new Point(155,123),new Point(154,126),new Point(154,130),new Point(154,133),new Point(154,136),new Point(154,140),new Point(154,143),new Point(154,146),new Point(154,149),new Point(155,152),new Point(157,156),new Point(159,158),new Point(163,160),new Point(165,163),new Point(167,164),new Point(169,166),new Point(172,168),new Point(174,170),new Point(176,170),new Point(179,172),new Point(182,173),new Point(185,174),new Point(189,175),new Point(192,176),new Point(197,177),new Point(202,179),new Point(207,179),new Point(211,180),new Point(215,180),new Point(218,180),new Point(222,180),new Point(226,180),new Point(229,180),new Point(232,180),new Point(235,180),new Point(238,180),new Point(242,180),new Point(244,180),new Point(246,180),new Point(248,179),new Point(250,177),new Point(252,176),new Point(255,174),new Point(258,173),new Point(262,171),new Point(265,168),new Point(268,167),new Point(270,165),new Point(271,163),new Point(272,163),new Point(273,162),new Point(274,160),new Point(277,158),new Point(278,155),new Point(280,152),new Point(281,149),new Point(282,148),new Point(283,146),new Point(283,145),new Point(283,144),new Point(283,143),new Point(283,141),new Point(284,141),new Point(284,139),new Point(284,138),new Point(285,136),new Point(287,135),new Point(287,134),new Point(288,134),new Point(288,135),new Point(288,136),new Point(288,137),new Point(288,138),new Point(288,139),new Point(288,140),new Point(288,141),new Point(288,142),new Point(288,143),new Point(288,144),new Point(288,145),new Point(288,146),new Point(288,147),new Point(288,148),new Point(288,150),new Point(288,152),new Point(288,154),new Point(288,156),new Point(288,157),new Point(288,159),new Point(288,160),new Point(288,162),new Point(288,163),new Point(288,164),new Point(288,166),new Point(288,168),new Point(288,170),new Point(288,171),new Point(288,173),new Point(288,174),new Point(288,175),new Point(288,176),new Point(288,177),new Point(288,178),new Point(288,179),new Point(288,180),new Point(288,181),new Point(288,182),new Point(288,184),new Point(288,186),new Point(288,189),new Point(288,193),new Point(288,195),new Point(288,198),new Point(288,200),new Point(288,203),new Point(288,207),new Point(288,209),new Point(288,213),new Point(288,217),new Point(288,220),new Point(288,223),new Point(288,227),new Point(288,229),new Point(288,232),new Point(288,234),new Point(288,235),new Point(288,237),new Point(288,239),new Point(288,241),new Point(288,244),new Point(288,246),new Point(288,248),new Point(288,251),new Point(288,254),new Point(288,257),new Point(289,260),new Point(289,263),new Point(290,266),new Point(290,267),new Point(290,269),new Point(290,272),new Point(290,274),new Point(290,276),new Point(291,278),new Point(291,280),new Point(291,282),new Point(291,284),new Point(291,286),new Point(291,288),new Point(292,290),new Point(292,292),new Point(292,294),new Point(292,295),new Point(292,296),new Point(292,297),new Point(292,298),new Point(292,299),new Point(292,300),new Point(292,301),new Point(292,302)));
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }
