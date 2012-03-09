-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2012 年 03 月 09 日 13:36
-- 服务器版本: 5.5.16
-- PHP 版本: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `linoblog`
--

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'untitled'),
(2, 'soloX'),
(6, 'SONG'),
(4, 'RT');

-- --------------------------------------------------------

--
-- 表的结构 `post`
--

CREATE TABLE IF NOT EXISTS `post` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `pubdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=35 ;

--
-- 转存表中的数据 `post`
--

INSERT INTO `post` (`id`, `title`, `content`, `pubdate`, `category_id`) VALUES
(1, 'test', 'long long ago...33CCQQ', '2012-04-04 16:00:00', 2),
(2, 'test', 'long long ago...', '2012-03-04 16:00:00', 1),
(4, 'test', 'long long ago...', '2012-03-04 16:00:00', 1),
(5, 'test', 'long long ago...', '2012-03-04 16:00:00', 1),
(6, 'test', 'long long ago...', '2012-03-06 16:00:00', 4),
(7, 'test', 'long long ago...xx', '2012-03-06 16:00:00', 1),
(8, 'test', 'long long ago...55-=\r\n', '2012-03-06 16:00:00', 1),
(11, 'test', 'long long ago...', '2012-03-06 16:00:00', 1),
(12, 'testxge', 'long long ago...gg', '2012-03-06 16:00:00', 1),
(13, 'test', 'long long ago...00', '2012-03-06 16:00:00', 1),
(16, 'ehw', 'eweew', '2012-03-08 08:37:33', 1),
(17, 'ehw', 'eweew', '2012-03-08 08:38:15', 4),
(18, 'eee', 'cgwgeg''''', '2012-03-08 08:38:25', 1),
(19, 'eee', 'cgwgegQQQQ', '2012-03-08 08:41:33', 1),
(20, 'GB34', 'cccGB', '2012-03-08 08:42:54', 2),
(32, 'dqweewrwrwq33', 'Geeee', '2012-03-09 12:21:11', 1),
(34, '566e', 'Gee eee', '2012-03-09 12:21:29', 1),
(30, 'dqweetewq', 'Geeee', '2012-03-09 12:21:01', 1),
(29, 'dqwweg', 'Gehehwe', '2012-03-09 12:20:55', 1),
(33, '33ggwe', 'Gee eee', '2012-03-09 12:21:24', 1),
(31, 'dqweewrwrwq', 'Geeee', '2012-03-09 12:21:06', 1);

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `passwd` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `passwd`) VALUES
(1, 'limon', 'bfbbd0dcf75b740834581a59828cbe85');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
